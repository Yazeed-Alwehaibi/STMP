import { applications } from "../../db/schema/application";

// Define mocks BEFORE importing the controller
const mockWhere = jest.fn();
const mockSet = jest.fn(() => ({ where: mockWhere }));
const mockUpdate = jest.fn(() => ({ set: mockSet }));

jest.mock("../../db/index", () => ({
  db: {
    update: mockUpdate,
  },
}));

// Now it's safe to import AFTER mocks are set up
import { rejectApplication } from "../../controllers/supervisor/appdecision";

describe("rejectApplication", () => {
  const mockReq = {
    body: { applicationId: 3 },
    user: { systemID: 4 },
  } as any;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects the application and responds with success", async () => {
    mockWhere.mockResolvedValue({ count: 1 });

    await rejectApplication(mockReq, mockRes);

    expect(mockUpdate).toHaveBeenCalledWith(applications);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "Application denied" });
  });

  it("returns 401 if user is missing", async () => {
    await rejectApplication({ ...mockReq, user: null }, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("returns 404 if no rows were updated", async () => {
    mockWhere.mockResolvedValueOnce({ count: 0 });

    await rejectApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Application not found" });
  });

  it("handles server errors", async () => {
    mockUpdate.mockImplementationOnce(() => {
      throw new Error("DB error");
    });

    await rejectApplication(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({ error: "Internal server error" });
  });
});
