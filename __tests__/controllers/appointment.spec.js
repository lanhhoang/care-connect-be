const Appointment = require("../../models/appointment");
const { apptList } = require("../../controllers/appointment");

describe("apptList", () => {
  it("should return a list of appointments", async () => {
    const mockAppointments = [
      { _id: "1", owner: { firstName: "John", lastName: "Doe" } },
      { _id: "2", owner: { firstName: "Jane", lastName: "Doe" } },
    ];
    const mockReq = { query: {} };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Appointment.find = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockAppointments),
    }));

    await apptList(mockReq, mockRes);

    expect(Appointment.find).toHaveBeenCalledWith({});
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockAppointments);
  });

  it("should return a list of appointments for a specific user", async () => {
    const mockAppointments = [
      { _id: "3", owner: { firstName: "John", lastName: "Doe" } },
      { _id: "4", owner: { firstName: "John", lastName: "Smith" } },
    ];
    const mockReq = { query: { userId: "123" } };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    Appointment.find = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockAppointments),
    }));

    await apptList(mockReq, mockRes);

    expect(Appointment.find).toHaveBeenCalledWith({ owner: "123" });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockAppointments);
  });
});
