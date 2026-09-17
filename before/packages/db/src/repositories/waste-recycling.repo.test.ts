import Database from 'better-sqlite3'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { runMigrations } from '../migrations/index'
import { WasteRecyclingRepo } from './waste-recycling.repo'

let db: Database.Database
let repo: WasteRecyclingRepo

beforeEach(() => {
  db = new Database(':memory:')
  runMigrations(db)
  repo = new WasteRecyclingRepo(db)
})

afterEach(() => db.close())

function createOrder() {
  return repo.createOrder({
    source_type: 'elderly',
    elderly_id: 'elderly-recycling-test',
    contact_name: '测试老人',
    contact_phone: '13800000000',
    pickup_type: 'pickup',
    pickup_address: '1号楼101室',
    appointment_at: '2026-08-23 10:00:00',
    estimated_weight: 10,
    created_by: 'user-admin',
    created_by_name: '管理员',
    remark: null,
  })
}

describe('WasteRecyclingRepo', () => {
  it('完成预约、派单、称重、积分结算、入库和出库闭环', () => {
    const order = createOrder()
    repo.assign(order.id, 'collector-1', '回收员')
    repo.startCollection(order.id)
    const metal = repo.findCategories().find(item => item.code === 'metal')!

    const weighed = repo.weigh(order.id, [{
      category_id: metal.id,
      material_name: '废旧铁器',
      gross_weight: 10,
      tare_weight: 1,
      unit_price_cents: 350,
      quality_grade: 'normal',
    }])
    expect(weighed).toMatchObject({ status: 'weighed', total_weight: 9, total_amount_cents: 3150, points: 27 })

    const settlement = repo.settle(order.id, { method: 'points', operator: '管理员', storage_location: 'A区' })
    expect(settlement).toMatchObject({ points: 27, cash_amount_cents: 0 })
    expect(repo.getPointsBalance('elderly-recycling-test')).toBe(27)

    const lot = repo.findInventory()[0]
    expect(lot).toMatchObject({ quantity: 9, remaining_quantity: 9, status: 'in_stock' })
    repo.transactInventory(lot.id, {
      transaction_type: 'out',
      quantity: 4,
      destination: '再生资源公司',
      counterparty: '测试回收企业',
      unit_price_cents: 500,
      operator: '管理员',
      occurred_at: '2026-08-23 16:00:00',
      remark: null,
    })
    expect(repo.findInventory()[0]).toMatchObject({ remaining_quantity: 5, status: 'partial' })

    expect(repo.complete(order.id).status).toBe('completed')
    expect(repo.getStats()).toMatchObject({
      total_orders: 1,
      completed_orders: 1,
      total_weight: 9,
      total_amount_cents: 3150,
      total_points: 27,
      inventory_weight: 5,
    })
  })

  it('阻止跳过称重直接结算和超库存出库', () => {
    const order = createOrder()
    expect(() => repo.settle(order.id, { method: 'cash' })).toThrow(/称重后才能结算/)

    repo.assign(order.id, 'collector-1', '回收员')
    const paper = repo.findCategories().find(item => item.code === 'paper')!
    repo.weigh(order.id, [{ category_id: paper.id, material_name: '纸箱', gross_weight: 2, tare_weight: 0 }])
    repo.settle(order.id, { method: 'cash' })
    const lot = repo.findInventory()[0]
    expect(() => repo.transactInventory(lot.id, {
      transaction_type: 'out', quantity: 3, destination: '回收企业', counterparty: null,
      unit_price_cents: 100, operator: null, occurred_at: '2026-08-23 16:00:00', remark: null,
    })).toThrow(/不能超过剩余库存/)
  })
})
