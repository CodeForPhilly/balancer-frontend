import { PatientInfo } from "./PatientTypes";
import minLogo from "../../assets/min.svg";
import maxLogo from "../../assets/max.svg";
import { useState, useEffect } from "react";
import axios from "axios";
import TypingAnimation from "../../components/Header/components/TypingAnimation";

interface PatientSummaryProps {
  patientInfo: PatientInfo;
  isPatientDeleted: boolean;
  setPatientInfo: React.Dispatch<React.SetStateAction<PatientInfo>>;
}

type RiskData = {
  benefits: string[];
  risks: string[];
};

const PatientSummary = ({
  patientInfo,
  isPatientDeleted,
}: PatientSummaryProps) => {
  const [showSummary, setShowSummary] = useState(true);
  const [loading, setLoading] = useState(false);
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [clickedMedication, setClickedMedication] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (isPatientDeleted) {
      // Reset the component's state
      setShowSummary(true);
      setLoading(false);
      setRiskData(null);
      setClickedMedication(null);
    }
  }, [isPatientDeleted]);

  useEffect(() => {
    // Clear the riskData whenever any data in patientInfo changes
    setRiskData(null);
    setClickedMedication(null);
  }, [patientInfo]);

  const handleClickSummary = () => {
    setShowSummary(!showSummary);
  };

  const handleMedicationClick = async (medication: string) => {
    // Toggle the clickedMedication
    if (clickedMedication === medication) {
      setClickedMedication(null);
      setRiskData(null); // Optionally, clear the riskData if medication is deselected

      return;
    } else {
      setClickedMedication(medication);
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:3001/risk", {
          diagnosis: medication,
        });
        setRiskData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
  };

  return (
    <div className="my-5 flex max-w-full items-center p-3 md:p-0">
      {patientInfo.Description && (
        <div
          className="flex flex-col gap-3 whitespace-normal break-words"
          style={{ width: "670px" }}
        >
          <div className="flex justify-between">
            <div>
              <h2 className="font-satoshi text-xl font-bold text-gray-600">
                <span className="blue_gradient">Summary</span>
              </h2>
            </div>
            <div onClick={handleClickSummary}>
              {showSummary ? (
                <img
                  src={minLogo}
                  alt="logo"
                  className="h-7 w-7 cursor-pointer hover:border-b-2 hover:border-blue-600"
                />
              ) : (
                <img
                  src={maxLogo}
                  alt="logo"
                  className="h-7 w-7 cursor-pointer hover:border-b-2 hover:border-blue-600"
                />
              )}
            </div>
          </div>
          {showSummary && (
            <div className="summary_box border-1bg-white ring-slate-1000/10 ring-1 hover:ring-slate-300">
              <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900">
                  Information
                </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6  text-gray-500">
                  Patient details and application.
                </p>
              </div>
              <div className="mt-3  border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="flex justify-between ">
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 ">
                      <dt className="text-sm font-medium leading-6 text-gray-900 ">
                        Patient ID:
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {patientInfo.ID}
                      </dd>
                    </div>
                    <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Current State:
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {patientInfo.Diagnosis}
                      </dd>
                    </div>
                  </div>
                  <div className="flex flex-row gap-4 px-4 py-3 sm:px-0 ">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Current Medications:
                    </dt>
                    <dt className=" text-sm  leading-6 text-gray-700">
                      {patientInfo.CurrentMedications}
                    </dt>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="flex text-sm font-medium leading-6 text-gray-900">
                      Possible Medications:
                      <div className="ml-3 mt-1 flex max-w-sm items-start text-white">
                        {loading ? <TypingAnimation /> : null}
                      </div>
                    </dt>
                    <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                      <ul
                        role="list"
                        className="divide-y divide-gray-100 rounded-md border border-gray-200"
                      >
                        {patientInfo.PossibleMedications &&
                          patientInfo.PossibleMedications.drugs?.map(
                            (medication: string) => (
                              <li
                                className={`flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-4 hover:bg-indigo-100
                                ${
                                  medication === clickedMedication
                                    ? "bg-indigo-100"
                                    : ""
                                } cursor-pointer`}
                                onClick={() =>
                                  handleMedicationClick(medication)
                                }
                              >
                                <div className="flex w-0 flex-1 items-center">
                                  <div className="ml-4 flex min-w-0 flex-1 gap-2">
                                    <span className="truncate font-medium">
                                      {medication}
                                    </span>
                                  </div>
                                </div>
                                <div className="ml-4 flex-shrink-0">
                                  <span className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Benefits and risks
                                  </span>
                                </div>
                              </li>
                            )
                          )}
                      </ul>
                    </dd>
                  </div>

                  {riskData && (
                    <div className="grid gap-4 px-0 px-4 py-1">
                      {/* <dt className="text-sm font-medium leading-6 text-gray-900">
                          Benefits and risks
                        </dt> */}
                      <dd className="mt-1 text-sm leading-6  text-gray-900 sm:col-span-2 sm:mt-0">
                        <div className="flex">
                          <div className=" w-[50%]">
                            <div>
                              <h4 className="mb-4 mt-4 text-sm font-medium text-indigo-600">
                                Benefits:
                              </h4>
                            </div>
                            <div className="">
                              <ul className="">
                                {riskData.benefits.map(
                                  (benefit: string, index: number) => (
                                    <li
                                      key={index}
                                      className="my-8  mr-1 h-10 text-sm hover:bg-indigo-100 md:my-0 md:mb-3"
                                    >
                                      {benefit}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                          <div className="w-[50%]">
                            <div>
                              <h4 className="mb-4 mt-4  text-sm font-medium  text-indigo-600">
                                Risks:
                              </h4>
                            </div>
                            <div className="">
                              <ul className="">
                                {riskData.risks.map(
                                  (risk: string, index: number) => (
                                    <li
                                      key={index}
                                      className=" my-8 mr-1 h-10 text-sm hover:bg-indigo-100 md:my-0 md:mb-3"
                                    >
                                      {risk}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientSummary;
