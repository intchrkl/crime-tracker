import React from "react";
import PropTypes from "prop-types";
import { get } from "../api";
import InvestigationOverview from "./InvestigationOverview";
import Crimes from "./Crimes";
import CurrentAssignments from "./CurrentAssignments"
import InvestigationNotes from "./InvestigationNotes"
import Suspects from "./Suspects"


function Investigation({ investigationId }) {
  const [investigation, setInvestigation] = React.useState();

  // load investigation data
  React.useEffect(() => {
    // gets data using API call
    get(`/v1/investigations/${investigationId}`).then((response) => {
      console.log(response);
      setInvestigation(response);
    });
  }, [investigationId, setInvestigation]);

  if (!investigation) {
    return <>loading...</>;
  }

  // get investigation data attributes from investigation JSON object
  // saves attributes to a const to reduce code clutter
  const investigationData = investigation.data.attributes;

  const cardStyle = {
    minHeight: "300px",
  };

  return (
    <>
      <h4>
        Investigation #{investigation.data.id}: {investigationData.title}
      </h4>

      <div class="row">
        <div class="col s6">
          {/* first component */}
          <InvestigationOverview investigation={investigation} />
        </div>
        <div class="col s6">
          {/* second component */}
          <Crimes
            crimes={investigationData.crimes}
            investigationId={investigationId}
          />
        </div>  
      </div>

      <div class="row">
        <div class="col s6">
          {/* third component */}
          <CurrentAssignments 
            investigation={investigation} 
            />
        </div>
        <div class="col s6">
          {/* fourth component */}
          <InvestigationNotes
            notes={investigationData.notes}
            investigationId={investigationId}
          />
        </div>
      </div>

      <div class="row">
        <div class="col s6">
          <Suspects
              suspects={investigationData.suspects}
              investigationId={investigationId}
          />
        </div>
      </div>

      
      
    </>
  );
}

Investigation.propTypes = {
  investigationId: PropTypes.string.isRequired,
};
export default Investigation;
