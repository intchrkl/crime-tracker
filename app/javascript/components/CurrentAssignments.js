import React from "react";
import FormattedDate from "./FormattedDate";

function CurrentAssignments({ investigation }) {
  const investigationData = investigation.data.attributes;
  var officersData = []
  const assignments = investigationData.current_assignments
  for (var assignment of assignments) {
    officersData.push(assignment.data.attributes.officer.data)
  }

  return (
    <>
      <div class="card grey lighten-2">
        <div class="card-content">
          <span class="card-title"><strong>Current Assignments</strong></span>
            {assignments.map( (assignment, index) => {
                let assignmentData = assignment.data.attributes
                let officerData = assignmentData.officer.data.attributes
                return (
                    <li key={`assignment-${assignmentData.id}`}>
                        <strong>
                            {officerData.rank}{" "}
                            {officerData.first_name}{" "}
                            {officerData.last_name}{" "}
                            {"as of: "}{FormattedDate(assignmentData.start_date)}
                        </strong>
                    </li>
                )
            })}
        </div>
      </div>
    </>
  );
}


export default CurrentAssignments;