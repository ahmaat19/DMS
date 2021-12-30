import EmployeeActivity from '../models/EmployeeActivity'

export default async function EActivity(type, description, doneBy, employee) {
  return await EmployeeActivity.create({
    type,
    description,
    doneBy,
    employee,
  })
}
