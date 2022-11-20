import { FieldTypeEventType } from '../eventType.types'
import { FunctionWithParamAndReturn } from '../../../utils'

export const eventTypeMapping:FunctionWithParamAndReturn<FieldTypeEventType, FieldTypeEventType> = (data2) => {
  const data1: FieldTypeEventType = {} as FieldTypeEventType
  if (data2) {
    if (data2.name) data1.name = data2.name
    if (data2.description) data1.description = data2.description
  }

  return data1
}
