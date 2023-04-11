const User = require("../../models/user");
const { userList, userSearch } = require("../../controllers/user");

jest.mock("../../models/user");

describe("userList", () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return a paginated list of users", async () => {
    const paginatedResult = {
      data: [
        { username: "user1" },
        { username: "user2" },
        { username: "user3" },
      ],
      page: 1,
      limit: 10,
      totalPage: 1,
    };
    res.paginatedResult = paginatedResult;

    await userList(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(paginatedResult);
  });
});

describe("userSearch", () => {
  const req = { query: { q: "test" } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return users that match the search query", async () => {
    const users = [{ firstName: "Test", lastName: "User" }];
    User.find.mockReturnValue({
      select: jest.fn().mockResolvedValue(users),
    });

    await userSearch(req, res, next);

    expect(User.find).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: [
          { firstName: expect.any(RegExp) },
          { lastName: expect.any(RegExp) },
          { email: expect.any(RegExp) },
          { phoneNumber: expect.any(RegExp) },
          { username: expect.any(RegExp) },
        ],
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
    expect(next).not.toHaveBeenCalled();
  });

  it("should return an error response if there is an error", async () => {
    const error = new Error("Test error");
    User.find.mockReturnValue({
      select: jest.fn().mockRejectedValue(error),
    });

    await userSearch(req, res, next);

    expect(User.find).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: [
          { firstName: expect.any(RegExp) },
          { lastName: expect.any(RegExp) },
          { email: expect.any(RegExp) },
          { phoneNumber: expect.any(RegExp) },
          { username: expect.any(RegExp) },
        ],
      })
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.any(String),
    });
    expect(next).not.toHaveBeenCalled();
  });
});
