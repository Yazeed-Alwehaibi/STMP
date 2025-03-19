import { Request, Response } from "express";
import { db } from "../../db/index"; // Adjust path based on your project structure
import { applications } from "../../db/schema/application";
import { usersTable } from "../../db/schema/users";
import { venues } from "../../db/schema/venues";
import { eq, isNull, and } from "drizzle-orm";
import { AuthRequest } from "../../middleware/auth";

export const getUnassignedStudents = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Ensure systemID exists in req.user
    const supervisorId = req.user?.systemID;
    if (!supervisorId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    // Get the supervisor's department
    const supervisor = await db
      .select({ department: usersTable.DepartmentOrMajor })
      .from(usersTable)
      .where(eq(usersTable.SystemID, Number(supervisorId)))
      .limit(1);

    if (!supervisor.length) {
      console.error("Supervisor not found:", supervisorId);
      res.status(404).json({ error: "Supervisor not found" });
      return;
    }

    const department = supervisor[0].department;
    if (department === null) {
      res.status(400).json({ error: "Supervisor does not have a department assigned" });
      return;
    }

    // Fetch unique unassigned students along with their training venue details
      const unassignedStudents = await db
    .select({
      applicationID: applications.ApplicationID,
      studentName: usersTable.UserName,
      studentID: usersTable.SystemID,
      trainingVenueName: venues.venueName,
      trainingVenueWebsite: venues.website,
    })
    .from(applications)
    .innerJoin(usersTable, eq(applications.studentID, usersTable.SystemID))
    .innerJoin(venues, eq(applications.venueID, venues.venueID))
    .where(and(isNull(applications.supervisorID), eq(usersTable.DepartmentOrMajor, department)))
    .groupBy(applications.ApplicationID, usersTable.SystemID, usersTable.UserName, venues.venueName, venues.website)
    .orderBy(applications.ApplicationID);



    if (unassignedStudents.length === 0) {
      res.status(404).json({ message: "No unassigned students found in your department" });
      return;
    }

    res.json(unassignedStudents);
  } catch (error) {
    console.error("Error fetching unassigned students:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
