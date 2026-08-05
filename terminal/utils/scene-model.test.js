import { describe, expect, it } from 'vitest'
import { normalizeSceneData, sceneBuildingSummary } from './scene-model'

describe('scene model', () => {
  it('归一化服务端楼栋、房间和床位字段', () => {
    const scene = normalizeSceneData({
      buildings: [{ id: 1, name: '康养楼', floors: 3 }],
      rooms: [{ id: 10, building_id: 1, floor: 2, room_no: '201', status: 'active' }],
      beds: [{ id: 100, room_id: 10, bed_no: 'A', status: 'occupied' }]
    })

    expect(scene.buildings[0]).toEqual({ id: '1', name: '康养楼', floors: 3 })
    expect(scene.rooms[0]).toMatchObject({ id: '10', buildingId: '1', floor: 2, roomNo: '201' })
    expect(scene.beds[0]).toEqual({ id: '100', roomId: '10', bedNo: 'A', status: 'occupied' })
    expect(sceneBuildingSummary(scene, 1)).toEqual({ rooms: 1, beds: 1 })
  })

  it('对空响应和未知床位状态保持可渲染', () => {
    expect(normalizeSceneData()).toEqual({ buildings: [], rooms: [], beds: [] })
    expect(normalizeSceneData({ beds: [{ id: 'b', roomId: 'r', status: 'disabled' }] }).beds[0].status).toBe('unknown')
  })
})
