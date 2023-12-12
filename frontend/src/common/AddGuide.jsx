import React, { useState, useEffect } from "react";
import { Formik, Form, Field, FieldArray } from "formik";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import guideService from "../services/guideService";
import { selectSystemVariables } from "../reduxStore/reducers/systemVariables";
import { useAppSelector } from "../reduxStore/hooks";
import eventService from "../services/eventService";
import authService from "../services/authService";
import { guideValidator } from "../validator/guideValidator";
import { formatDateToDdMmYyyy, generatePreviews } from "../utils/functions";

const AddGuide = () => {
  const SystemVariables = useAppSelector(selectSystemVariables);
  const [rowData, setRowData] = useState({
    experts: "",
    report: { title: "", url: "" },
  });
  const [reports, setReports] = useState([]);
  const [reportFormData, setReportFormData] = useState(null);
  const [guideType, setGuideType] = useState(
    SystemVariables.GUIDE_TYPE.PHD
  );

  const [guideInit, setGuideInit] = useState({});

  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    if (id != undefined) {
      setGuideType("");
      var guidePromise = guideService.getGuide(id);
      guidePromise.then((res) => {
        var guideData = res.guide;
        console.log("useEffect guideData : ", guideData);
        // const temp = resEvent.userId._id;
        guideData.userId = guideData.userId._id;

        setGuideType(guideData.guideType);
        setReports(guideData.reports)
        setGuideInit(guideData);
        // setFieldValue("title",res.event.title);
        // setEventDetail(res.event);
      });
    }
  }, [id]);

  function HandleAddGuide(values) {
    values.guideType = guideType;
    values.reports = reports;
    values.userId = authService.getCurrentUserId();
    const { _id, __v, ...data } = values;
    console.log("Values: ", values);

    const { error } = guideValidator.validate(data);
    if (error) {
      toast.error(error.toString());
      return;
    }
    if (_id) {
      const guidePromise = guideService.updateGuide(
        _id,
        data
      );
      toast.promise(
        guidePromise,
        {
          loading: "please wait while adding guide data",
          success: (data) => data.message,
          error: (err) => err,
        },
        {
          style: {
            minWidth: "250px",
          },
          success: {
            duration: 1500,
            icon: "🔥",
          },
          error: {
            duration: 1500,
            icon: "🔥",
          },
        }
      );
      guidePromise
        .then((res) => {
          console.log("res: ", res);
          navigate("/guide");
          //   toast.success("guide is added");
        })
        .catch((error) => {
          //   toast.error("guide is not added");
        });
    } else {
      const guidePromise = guideService.addGuide(data);
      toast.promise(
        guidePromise,
        {
          loading: "please wait while adding guide data",
          success: (data) => data.message,
          error: (err) => err,
        },
        {
          style: {
            minWidth: "250px",
          },
          success: {
            duration: 1500,
            icon: "🔥",
          },
          error: {
            duration: 1500,
            icon: "🔥",
          },
        }
      );
      guidePromise
        .then((res) => {
          console.log("res: ", res);
          navigate("/guide");
          //   toast.success("guide is added");
        })
        .catch((error) => {
          //   toast.error("guide is not added");
        });
    }
  }

  const handleAddReport = () => {
    const report = rowData.report;
    if (report.title.trim() !== "") {
      if (!reportFormData) {
        toast.error("please select report file ");
        return;
      }

      console.log("reportFormData : ", reportFormData);
      const reportPromise = eventService.uploadReportOfEvent(reportFormData);
      reportPromise
        .then((res) => {
          console.log("report upload response : ", res.uploadedFiles);
          setReports((prevData) => [
            ...prevData,
            { title: report.title, url: res.uploadedFiles[0] },
          ]);
          setRowData((prevData) => ({
            ...prevData,
            report: { title: "", url: "" },
          }));
          setReportFormData(null);
        })
        .catch((error) => {
          // setReportFormData(null);
        });
    }
  };
  const handleRemoveReport = (index) => {
    const updatedReports = [...reports];
    updatedReports.splice(index, 1);
    setReports(updatedReports);
  };
  const handleRowDataInputChange = (event) => {
    const { name, value } = event.target;
    if (name.startsWith("report.")) {
      const [parent, child] = name.split(".");
      if (child == "url") {
        const file = event.target.files[0];
        if (!file) {
          toast.error("Please select an image to upload.");
          return;
        }
        const formData = new FormData();
        formData.append("reports", file);
        setReportFormData(formData);
      }
      setRowData((prevData) => ({
        ...prevData,
        report: {
          ...prevData.report,
          [child]: value,
        },
      }));
    } else {
      setRowData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const [previews, setPreviews] = useState([]);
  useEffect(() => {
    generatePreviews(reports, setPreviews);
  }, [guideInit.reports, reports]);


  return (
    <>
      <div className="flex flex-col shadow-md sm:rounded-lg">
        <h1 className="text-3xl  mx-auto  text-gray-900 font-bold dark:text-white">
          Add Your Guide
        </h1>
        <hr className="mt-2" />
        <Formik
          initialValues={guideInit}
          enableReinitialize={true}
          onSubmit={(values, { setSubmitting }) => {
            HandleAddGuide(values);
            setSubmitting(false);
          }}
        >
          {({ values, setFieldValue }) => (
            <>
              <Form>
                <div className="mt-4 mb-6 flex items-center justify-center">
                  <Field
                    as="select"
                    name="guideType"
                    className="bg-gray-50 h-8 py-0 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block dark:bg-gray-900 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:font-bold dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={(e) => {
                      setGuideType(e.target.value);
                    }}
                  >
                    <option value={SystemVariables.PUBLICATION_TYPE.MTECH}>
                      {SystemVariables.GUIDE_TYPE.MTECH}
                    </option>
                    <option value={SystemVariables.PUBLICATION_TYPE.PHD}>
                      {SystemVariables.GUIDE_TYPE.PHD}
                    </option>
                  </Field>
                </div>
                <div className="mt-10 m-10 flex flex-col">
                  {/* Event Details */}
                  <div className="flex flex-col">
                    <div className="mt-2 grid md:grid-cols-2 md:gap-6">
                      <div className="relative z-0 w-full mb-6 group">
                        <Field
                          name="dissertationTitle"
                          id="dissertationTitle"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300  appearance-none dark:text-white dark:border-gray-500 dark:focus:border-blue-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=" "
                          required
                        />
                        <label
                          htmlFor="dissertationTitle"
                          className="peer-focus:font-medium absolute  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Dissertation Title
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-6 group">
                        <Field
                          type="number"
                          name="guidedYear"
                          id="guidedYear"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300  appearance-none dark:text-white dark:border-gray-500 dark:focus:border-blue-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=""
                          required
                        />
                        <label
                          htmlFor="guidedYear"
                          className="peer-focus:font-medium absolute  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Guide Year
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="mt-2 grid md:grid-cols-2 md:gap-6">
                      <div className="relative z-0 w-full mb-6 group">
                        <Field
                          type="text"
                          name="studentDetails.name"
                          id="studentDetails.name"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300  appearance-none dark:text-white dark:border-gray-500 dark:focus:border-blue-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=""
                          required
                        />
                        <label
                          htmlFor="studentDetails.name"
                          className="peer-focus:font-medium absolute  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Student Name
                        </label>
                      </div>
                      <div className="relative z-0 w-full mb-6 group">
                        <Field
                          type="text"
                          name="studentDetails.idNumber"
                          id="studentDetails.idNumber"
                          className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300  appearance-none dark:text-white dark:border-gray-500 dark:focus:border-blue-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                          placeholder=""
                          required
                        />
                        <label
                          htmlFor="studentDetails.idNumber"
                          className="peer-focus:font-medium absolute  text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-1 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                          Student's Id Number
                        </label>
                      </div>
                    </div>
                  </div>


                  {/* reports */}
                  <div className="flex flex-col">
                    <h3 className="mt-4 mx-auto  text-xl font-bold text-gray-900 dark:text-white">
                      Upload Report
                    </h3>
                    <hr className="w-48 h-1 mx-auto bg-gray-300 border-0 rounded md:mt-2 md:mb-4 dark:bg-gray-700" />
                    <div className="my-6 mx-10 mb-4 px-10 w-full">
                      <div className="flex flex-row  items-center justify-between  ">
                        <div className="flex flex-col w-full px-10 ">
                          <div className="relative z-0 w-full mb-6 group">
                            <input
                              onChange={handleRowDataInputChange}
                              value={rowData.report.title}
                              type="text"
                              name="report.title"
                              id="report.title"
                              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-blue-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder="Enter Report's Title"
                            />
                          </div>
                          <div className=" z-0 w-full mb-6 group">
                            <input
                              onChange={handleRowDataInputChange}
                              value={rowData.report.url}
                              type="file"
                              name="report.url"
                              id="report.url"
                              className="block  p-0 w-full text-sm text-gray-900 bg-transparent border-0 border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-500 dark:focus:border-blue-600 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                              placeholder="Upload report"
                            />
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleAddReport}
                          className=" right-2 h-10 p-2 rounded-lg focus:bg-gray-300 text-blue-700 dark:text-blue-500 hover:text-blue-900 dark:hover:text-blue-700 focus:outline-none"
                        >
                          Add
                        </button>
                      </div>
                      <div className="w-full flex flex-row  space-x-5 ">
                        {previews.map((preview, index) => (
                          <div
                            key={index}
                            className="flex flex-col space-y-2 border-2 border-gray-200 dark:border-white-200 text-sm text-gray-900 dark:text-white"
                          >
                            <div
                              className="bg-red-100 text-center  border-2 border-gray-200 dark:border-white-200 text-red-700 dark:text-red-500 hover:text-red-900 dark:hover:text-red-700 focus:outline-none"
                            >
                              {preview.title} ({preview.doc_type})
                            </div>
                            <div className="cursor-pointer ">{preview.element}</div>
                            <button
                              type="button" onClick={() => handleRemoveReport(index)}
                              className="bg-red-100   border-2 border-gray-200 dark:border-white-200 text-red-700 dark:text-red-500 hover:text-red-900 dark:hover:text-red-700 focus:outline-none"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm  sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Save
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default AddGuide;