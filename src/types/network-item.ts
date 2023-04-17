import Entity from '@/types/entity'

export default interface NetworkItem {
    name: string,
    inputFrom: Entity,
    outputTo: Entity,
}