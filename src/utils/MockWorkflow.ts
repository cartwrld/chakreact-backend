import { Workflow } from '../entity/Workflow'

const MockWorkflowCollection: Workflow[] = [
  new Workflow(
    'SDXL',
    'portrait, photograph, girl standing in the rain, facing camera',
    '',
    'dynavision_v0557.safetensors',
    61846986432,
    25,
    6,
    'euler',
    'karras',
    1024,
    1024
  ),
  new Workflow(
    'SDXL',
    'inuit man standing outside of an igloo',
    '',
    'dynavision_v0557.safetensors',
    1651686486562,
    20,
    7,
    'dpmpp_2m',
    'karras',
    1344,
    768
  )
]

export default MockWorkflowCollection
