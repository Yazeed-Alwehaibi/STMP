import { Request, Response } from "express";
import { db } from "../../db/index"; // Adjust path based on your project structure
import { applications } from "../../db/schema/application"; // Assuming applications & users tables
import { usersTable } from "../../db/schema/users";
import { eq, isNull, and } from "drizzle-orm";
import { AuthRequest } from "../../middleware/auth";

export const getUnassignedStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Ensure systemID exists in req.user
    const supervisorId = req.user?.systemID;
    if (!supervisorId) {
      res.status(401).json({ error: "Unauthorized" }); // Send the error response here
      return; // Return to stop further execution
    }

    // Get the supervisor's department
    const supervisor = await db
      .select({ department: usersTable.DepartmentOrMajor })
      .from(usersTable)
      .where(eq(usersTable.SystemID, Number(supervisorId)))
      .limit(1);

    if (!supervisor.length) {
      console.error("Supervisor not found:", supervisorId);
      res.status(404).json({ error: "Supervisor not found" }); // Send the error response here
      return; // Return to stop further execution
    }

    const department = supervisor[0].department;

    // If department is null, handle the error
    if (department === null) {
      res.status(400).json({ error: "Supervisor does not have a department assigned" }); // Send the error response here
      return; // Return to stop further execution
    }

    // Fetch students from the same department without a supervisor
    const unassignedStudents = await db
      .select()
      .from(applications)
      .innerJoin(usersTable, eq(applications.studentID, usersTable.SystemID)) // Assuming studentID is used to link with users
      .where(and(isNull(applications.supervisorID), eq(usersTable.DepartmentOrMajor, department))); // No assigned supervisor and same department

    if (unassignedStudents.length === 0) {
      res.status(404).json({ message: "No unassigned students found in your department" }); // Send the response here
      return; // Return to stop further execution
    }

    res.json(unassignedStudents); // Send the unassigned students list

  } catch (error) {
    console.error("Error fetching unassigned students:", error);
    res.status(500).json({ error: "Internal server error" }); // Send the error response here
  }
};
