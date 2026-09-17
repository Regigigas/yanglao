import Database from 'better-sqlite3';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { runMigrations } from '../migrations/index';
import { AssistedServicesRepo } from './assisted-services.repo';

let db: Database.Database;
let repo: AssistedServicesRepo;

beforeEach(() => {
  db = new Database(':memory:');
  runMigrations(db);
  repo = new AssistedServicesRepo(db);
});

afterEach(() => db.close());

describe('AssistedServicesRepo', () => {
  it('完成处方药代买、派单、签收并归集月度账单', () => {
    const order = repo.createPurchaseOrder({
      elderly_id: 'elderly-1', service_catalog_id: 'service-medicine', category: 'medicine', charge_mode: 'custom',
      requester_name: '测试老人', requester_phone: null,
      merchant_name: '合作药房', delivery_address: '1号楼101', expected_at: '2026-08-23 12:00',
      delivery_fee_cents: 500, service_fee_cents: 300, advance_amount_cents: 0,
      prescription_required: 1, prescription_no: null, created_by: 'admin', created_by_name: '管理员', remark: null,
    }, [{
      item_name: '处方药A', specification: '10mg*10片', quantity: 2, unit: '盒', unit_price_cents: 2500,
      medicine_type: 'prescription', dosage: '每日一次', remark: null,
    }]);
    expect(order).toMatchObject({ total_amount_cents: 5800, status: 'pending', prescription_required: 1 });
    repo.assignPurchase(order.id, 'staff-1', '代办员');
    expect(() => repo.startPurchase(order.id)).toThrow(/处方核验/);
    repo.verifyPrescription(order.id, 'RX-20260823-01', '护士长');
    repo.startPurchase(order.id);
    repo.startDelivery(order.id);
    repo.signPurchase(order.id, '测试老人');
    const settled = repo.settlePurchase(order.id, 'monthly_bill');
    expect(settled).toMatchObject({ status: 'settled', settlement_status: 'monthly_bill' });
    expect(settled.bill_id).toBeTruthy();
    expect(db.prepare('SELECT total FROM monthly_bill WHERE id=?').get(settled.bill_id)).toEqual({ total: 58 });
    expect(db.prepare('SELECT item_name,amount FROM bill_detail WHERE bill_id=?').get(settled.bill_id)).toEqual({ item_name: `代买服务 ${order.order_no}`, amount: 58 });
  });

  it('代拿快递支持免费、固定收费和零元结算', () => {
    const packageService = repo.findServiceCatalog().find((item) => item.code === 'package_pickup');
    expect(packageService).toMatchObject({ charge_mode: 'free', default_service_fee_cents: 0 });
    const createPackageOrder = (chargeMode: 'free' | 'fixed') => repo.createPurchaseOrder({
      elderly_id: 'elderly-package', service_catalog_id: packageService!.id, category: 'package_pickup',
      charge_mode: chargeMode, requester_name: '快递老人', requester_phone: '13800000000',
      merchant_name: '社区快递站', delivery_address: '2号楼201', expected_at: '2026-08-24 16:00',
      delivery_fee_cents: 0, service_fee_cents: 800, advance_amount_cents: 0,
      prescription_required: 0, prescription_no: null, created_by: 'admin', created_by_name: '管理员', remark: '取件码 1234',
    }, [{
      item_name: '快递包裹', specification: null, quantity: 1, unit: '件', unit_price_cents: 0,
      medicine_type: null, dosage: null, remark: null,
    }]);

    const freeOrder = createPackageOrder('free');
    expect(freeOrder).toMatchObject({ category: 'package_pickup', service_fee_cents: 0, total_amount_cents: 0 });
    repo.assignPurchase(freeOrder.id, 'staff-package', '快递代办员');
    repo.startPurchase(freeOrder.id);
    repo.startDelivery(freeOrder.id);
    repo.signPurchase(freeOrder.id, '快递老人');
    const settled = repo.settlePurchase(freeOrder.id, 'monthly_bill');
    expect(settled).toMatchObject({ status: 'settled', settlement_status: 'paid', bill_id: null });

    repo.updateServiceCatalog(packageService!.id, { charge_mode: 'fixed', default_service_fee_cents: 500 });
    const chargedOrder = createPackageOrder('fixed');
    expect(chargedOrder).toMatchObject({ service_fee_cents: 500, total_amount_cents: 500 });
  });

  it('完成合作机构预约、陪诊、诊疗归档与随访闭环', () => {
    const partner = repo.createPartner({
      name: '社区合作诊所', partner_type: 'clinic', hospital_level: null, specialties: '全科、慢病',
      contact_name: '张医生', contact_phone: '13800000000', address: '社区路1号', emergency_channel: '绿色电话',
      agreement_no: 'COOP-001', agreement_start: '2026-01-01', agreement_end: '2027-01-01',
      settlement_cycle: '按月', status: 'active', remark: null,
    });
    const referral = repo.createReferral({
      elderly_id: 'elderly-2', partner_id: partner.id, service_type: 'escort', priority: 'normal',
      appointment_at: '2026-08-24 09:00', department: '全科', doctor: '张医生', reason: '复查血压', symptoms: null,
      escort_required: 1, escort_user_id: 'staff-2', escort_user_name: '陪诊员', created_by: 'admin', created_by_name: '管理员', remark: null,
    });
    repo.confirmReferral(referral.id);
    repo.departReferral(referral.id);
    repo.startConsultation(referral.id);
    const completed = repo.completeReferral(referral.id, {
      diagnosis: '血压控制稳定', treatment_plan: '维持现有治疗', prescription: '继续原药',
      next_visit_at: '2026-09-24 09:00', medical_fee_cents: 12000, transport_fee_cents: 2000,
      service_fee_cents: 3000, settlement_method: 'monthly_bill',
    });
    expect(completed).toMatchObject({ status: 'completed', total_amount_cents: 17000, settlement_status: 'monthly_bill' });
    expect(db.prepare('SELECT hospital,diagnosis,cost FROM medical_visit WHERE elderly_id=?').get('elderly-2'))
      .toEqual({ hospital: '社区合作诊所', diagnosis: '血压控制稳定', cost: 170 });
    repo.createFollowUp({
      referral_id: referral.id, follow_up_at: '2026-08-26 10:00', method: 'phone', condition: '状态稳定',
      medication_compliance: '按时服药', adverse_reaction: null, next_action: '继续观察',
      next_follow_up_at: '2026-09-02 10:00', staff_id: 'staff-2', staff_name: '陪诊员',
    });
    expect(repo.findReferral(referral.id).status).toBe('follow_up');
    expect(repo.findFollowUps(referral.id)).toHaveLength(1);
    expect(repo.getStats()).toMatchObject({ referral_total: 1, referral_follow_up: 1, active_partners: 1 });
  });
});
