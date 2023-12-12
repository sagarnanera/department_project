import React, { useEffect, useState, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import { selectUserDetails } from "../reduxStore/reducers/userDetailSlice";
import { selectSystemVariables } from "../reduxStore/reducers/systemVariables.jsx";
import { useAppDispatch, useAppSelector } from "../reduxStore/hooks";
import { useNavigate, useParams } from "react-router-dom";
import { formatDateToDdMmYyyy, generatePreviews } from "../utils/functions";
import { IQualification } from "../interfaces/interfaces";
import { qualificationDetailValidator } from "../validator/qualificationValidator";
import qualificationService from "../services/qualificationService";
import authService from "../services/authService";

import * as pdfjs from "pdfjs-dist/build/pdf";
import "pdfjs-dist/build/pdf.worker.entry";

export default function NormalQualificationView() {
  const SystemVariables = useAppSelector(selectSystemVariables);
  const userDetail = useAppSelector(selectUserDetails);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [qualificationDetail, setQualificationDetail] = useState({});

  const { id } = useParams();

  useEffect(() => {
    if (id != undefined) {
      var qualificationPromise = qualificationService.getQualification(id);
      qualificationPromise.then((res) => {
        var resQualification = res.qualification;
        console.log("getQualification : ", resQualification);
        resQualification.userId = resQualification.userId._id;

        setQualificationDetail(res.qualification);
      });
      setQualificationDetail((prevData) => ({ ...prevData, _id: id }));
    }
  }, [id]);

  useEffect(() => {
    setQualificationDetail((prevData) => ({
      ...prevData,
      userId: authService.getCurrentUserId(),
    }));
  }, []);

  const handelQualificationDelete = () => {
    if (id == undefined) {
      toast.error("can not delete at this time");
      return;
    }
    const _id = id;
    const qualificationPromise = qualificationService.deleteQualification(_id);
    qualificationPromise
      .then((res) => {
        console.log("users : ", res);

        navigate("/qualification");
      })
      .catch((error) => {
        console.log("error : ", error);
      });

    toast.promise(
      qualificationPromise,
      {
        loading: "please wait while we deleting qualification",
        success: (data) => data.message,
        error: (err) => err,
      },
      {
        style: {
          minWidth: "250px",
        },
        success: {
          duration: 3000,
          icon: "🔥",
        },
        error: {
          duration: 4000,
          icon: "🔥",
        },
      }
    );
  };


  const [previews, setPreviews] = useState([]);
  useEffect(() => {

    generatePreviews(qualificationDetail.certificates, setPreviews);
  }, [qualificationDetail]);
  return (
    <div className="flex flex-col shadow-md sm:rounded-lg">
      <h1 className="text-3xl mx-auto font-bold text-gray-900 dark:text-white">
        Qualification
      </h1>
      <hr className="mt-2" />

      <div className="mt-10 m-5 p-5 flex flex-col">
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="mb-6">
            <label className="text-gray-700 dark:text-white font-bold">
              Qualification Type
            </label>
            <div className="mt-2 ml-2 text-gray-900 dark:text-white">
              {qualificationDetail.qualificationType}
            </div>
          </div>
          {qualificationDetail.qualificationType === SystemVariables.QUALIFICATION_TYPE.PHD ?
            <div className="mb-6">
              <label className="text-gray-700 dark:text-white font-bold">
                thesisTitle
              </label>
              <div className="mt-2 ml-2 text-gray-900 dark:text-white">
                {qualificationDetail.thesisTitle}
              </div>
            </div> : <></>}
        </div>

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="mb-6">
            <label className="text-gray-700 dark:text-white font-bold">
              specialization
            </label>
            <div className="mt-2 ml-2 text-gray-900 dark:text-white">
              {qualificationDetail.specialization}
            </div>
          </div>
          <div className="mb-6">
            <label className="text-gray-700 dark:text-white font-bold">
              institute
            </label>
            <div className="mt-2 ml-2 text-gray-900 dark:text-white">
              {qualificationDetail.institute}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="mb-6">
            <label className="text-gray-700 dark:text-white font-bold">
              status
            </label>
            <div className="mt-2 ml-2 text-gray-900 dark:text-white">
              {qualificationDetail.status}
            </div>
          </div>
          <div className="mb-6">
            <label className="text-gray-700 dark:text-white font-bold">
              completionYear
            </label>
            <div className="mt-2 ml-2 text-gray-900 dark:text-white">
              {qualificationDetail.completionYear}
            </div>
          </div>
        </div>



      
      
{previews.length? 
        <div className="flex flex-col justify-center items-center">
          <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
            certificates
          </h3>
          <div className="my-6">
            <div className="w-full flex flex-row  space-x-5 ">
              {previews.map((preview, index) => (
                <div
                  key={index}
                  className="flex flex-col space-y-2 border-2 border-gray-200 dark:border-white-200 text-sm text-gray-900 dark:text-white"
                >
                  <button className="bg-red-100   border-2 border-gray-200 dark:border-white-200 text-red-700 dark:text-red-500 hover:text-red-900 dark:hover:text-red-700 focus:outline-none">
                    {preview.title} ( {preview.doc_type} )
                  </button>
                  <div className="cursor-pointer ">{preview.element}</div>
                </div>
              ))}
            </div>
          </div>
          </div>
          :
          <div className="flex flex-col justify-center items-center">
            <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
              There is no certificates
            </h3>
          </div>
        }
      </div>
    </div>
  );
}