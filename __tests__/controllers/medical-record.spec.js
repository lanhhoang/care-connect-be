const MedicalRecord = require("../../models/medical-record");
const User = require("../../models/user");
const { medList, medAdd } = require("../../controllers/medical-record");

describe("medList", () => {
  it("should return a list of appointments", async () => {
    const mockMedicalRecords = [
      { _id: "1", owner: { firstName: "John", lastName: "Doe" } },
      { _id: "2", owner: { firstName: "Jane", lastName: "Doe" } },
    ];
    const mockReq = { query: {} };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    MedicalRecord.find = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockMedicalRecords),
    }));

    await medList(mockReq, mockRes);

    expect(MedicalRecord.find).toHaveBeenCalledWith({});
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockMedicalRecords);
  });

  it("should return a list of MedicalRecords for a specific user", async () => {
    const mockMedicalRecords = [
      { _id: "3", owner: { firstName: "John", lastName: "Doe" } },
      { _id: "4", owner: { firstName: "John", lastName: "Smith" } },
    ];
    const mockReq = { query: { userId: "123" } };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    MedicalRecord.find = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValue(mockMedicalRecords),
    }));

    await medList(mockReq, mockRes);

    expect(MedicalRecord.find).toHaveBeenCalledWith({ owner: "123" });
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockMedicalRecords);
  });
});

describe("medAdd", () => {
  it("should add a new medical record for a specified user", async () => {
    const mockUser = { _id: "2" };
    const mockMedicalRecord = { _id: "3", owner: "2", diagnosis: "Cancer" };
    const mockReq = { body: { owner: "2", diagnosis: "Cancer" } };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const mockCreate = jest
      .fn()
      .mockImplementation((item, callback) =>
        callback(null, mockMedicalRecord)
      );
    MedicalRecord.create = mockCreate;
    User.findByIdAndUpdate = jest.fn();

    await medAdd(mockReq, mockRes);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockMedicalRecord);
  });

  it("should return an error message if an error occurs", async () => {
    const mockError = new Error("Database error");
    const mockReq = { payload: { id: "1" }, body: { diagnosis: "Flu" } };
    const mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const mockCreate = jest
      .fn()
      .mockImplementation((item, callback) => callback(mockError, null));
    MedicalRecord.create = mockCreate;

    await medAdd(mockReq, mockRes);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.any(Object),
      expect.any(Function)
    );
    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      message: expect.any(String),
    });
  });
});
