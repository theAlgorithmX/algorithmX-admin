import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import axiosHttp from "../../../../utils/httpConfig";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { classes } from "../../../../Data/Layouts";

const defaultLayoutObj = classes.find(
  (item) => Object.values(item).pop(1) === "compact-wrapper"
);
const layout =
  localStorage.getItem("layout") || Object.keys(defaultLayoutObj).pop();

const AddClientForm = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const clientId = searchParams.get("clientId");
  const isEditMode = Boolean(clientId);

  //const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({
    defaultValues: {
      projectType: "Web",
      brandName: "",
      brandVideoURL: "",
      brandRGB: "#000000",
      brandVideoTitle: "",
      brandIndustry: "",
      brandServices: "",
      brandType: "",
      brandLogo: "",
      brandImage: "",
      brandAboutDesc: "",
      aboutImages: ["", ""],
      solutionImage: "",
      solutionTitle: "",
      solutionDesc: "",
      clientImage: "",
      clientName: "",
      clientDesignation: "",
      clientTestimonial: "",
      resultTitle: "",
      resultPointers: [
        { title: "", image: "" },
        { title: "", image: "" },
        { title: "", image: "" },
      ],
      businessProcess: [
        { title: "", category: "", description: "" },
        { title: "", category: "", description: "" },
        { title: "", category: "", description: "" },
        { title: "", category: "", description: "" },
      ],
      wireFrameImages: ["", ""],
      prototypeImages: ["", ""],
      techStackTitle: "",
      techstackImages: ["", ""],
      projectGoals: [
        { title: "", description: "" },
        { title: "", description: "" },
        { title: "", description: "" },
        { title: "", description: "" },
      ],
      projectGoalImg: "",
      optimizationTitle: "",
      optimizationDesc: "",
      optimizationPointers: [
        { title: "", description: "", image: "" },
        { title: "", description: "", image: "" },
        { title: "", description: "", image: "" },
      ],
      metrices: {
        avgRatings: "",
        conversionRate: "",
        totalOrders: "",
        repeatPurchases: "",
        orderFulfilledPerDay: "",
        sessionRevenueUplift: "",
      },
    },
  });

  const projectType = watch("projectType");

  const {
    fields: resultPointerFields,
    append: appendResultPointer,
    remove: removeResultPointer,
  } = useFieldArray({
    control,
    name: "resultPointers",
  });

  const {
    fields: techStackFields,
    append: appendTechStackField,
    remove: removeTechStackField,
    replace: replaceTechStack,
  } = useFieldArray({
    control,
    name: "techstackImages",
  });

  const {
    fields: optimizationFields,
    append: appendOptimization,
    remove: removeOptimization,
  } = useFieldArray({
    control,
    name: "optimizationPointers",
  });

  const { fields: aboutImgFields, replace: replaceAboutImg } = useFieldArray({
    control,
    name: "aboutImages",
  });

  const { fields: wireFrameFields, replace: replaceWireFrame } = useFieldArray({
    control,
    name: "wireFrameImages",
  });

  const { fields: prototypeFields, replace: replacePrototype } = useFieldArray({
    control,
    name: "prototypeImages",
  });

  // Store files in state to prevent clearing on re-render
  const [fileStorage, setFileStorage] = React.useState({});

  // Update field arrays when project type changes
  React.useEffect(() => {
    if (projectType === "Web") {
      replaceAboutImg(["", ""]);
      replaceWireFrame(["", ""]);
      replacePrototype(["", ""]);
    } else {
      replaceAboutImg(["", "", "", ""]);
      replaceWireFrame(["", "", "", "", ""]);
      replacePrototype(["", "", "", "", ""]);
    }
  }, [projectType, replaceAboutImg, replaceWireFrame, replacePrototype]);

  // Store file when selected
  // Update the handleFileChange function
  const handleFileChange = (fieldName, files) => {
    if (files && files.length > 0) {
      console.log(`Storing file for ${fieldName}:`, files[0]); // Add logging
      setFileStorage((prev) => ({
        ...prev,
        [fieldName]: files[0],
      }));
    }
  };

  // Fetch client data if in edit mode
  useEffect(() => {
    const fetchClientData = async () => {
      if (isEditMode && clientId) {
        try {
          const response = await axiosHttp.get(`/clients/${clientId}`);
          if (response?.status === 200) {
            const clientData = response.data.data;

            // Set form values
            setValue(
              "projectType",
              clientData.productType === "web" ? "Web" : "App"
            );
            setValue("brandName", clientData.brandName || "");
            setValue("brandVideoURL", clientData.brandVideoURL || "");
            setValue("brandRGB", clientData.brandRGB || "#000000");
            setValue("brandVideoTitle", clientData.brandVideoTitle || "");
            setValue("brandIndustry", clientData.brandIndustry || "");
            setValue("brandServices", clientData.brandServices || "");
            setValue("brandType", clientData.brandType || "");
            setValue("brandAboutDesc", clientData.brandAboutDesc || "");
            setValue("solutionTitle", clientData.solutionTitle || "");
            setValue("solutionDesc", clientData.solutionDesc || "");
            setValue("clientName", clientData.clientName || "");
            setValue("clientDesignation", clientData.clientDesignation || "");
            setValue("clientTestimonial", clientData.clientTestimonial || "");
            setValue("resultTitle", clientData.resultTitle || "");
            setValue("techStackTitle", clientData.techStackTitle || "");
            setValue("optimizationTitle", clientData.optimizationTitle || "");
            setValue("optimizationDesc", clientData.optimizationDesc || "");

            // Handle metrics data
            if (clientData.metrices) {
              setValue(
                "metrices.avgRatings",
                clientData.metrices.avgRatings || ""
              );
              setValue(
                "metrices.conversionRate",
                clientData.metrices.conversionRate || ""
              );
              setValue(
                "metrices.totalOrders",
                clientData.metrices.totalOrders || ""
              );
              setValue(
                "metrices.repeatPurchases",
                clientData.metrices.repeatPurchases || ""
              );
              setValue(
                "metrices.orderFulfilledPerDay",
                clientData.metrices.orderFulfilledPerDay || ""
              );
              setValue(
                "metrices.sessionRevenueUplift",
                clientData.metrices.sessionRevenueUplift || ""
              );
            }

            // Handle arrays and complex objects
            if (clientData.aboutImgURLs) {
              replaceAboutImg(clientData.aboutImgURLs);
            }
            if (clientData.wireFrameURLs) {
              replaceWireFrame(clientData.wireFrameURLs);
            }
            if (clientData.prototypeURLs) {
              replacePrototype(clientData.prototypeURLs);
            }
            if (clientData.techStackURLs) {
              replaceTechStack(clientData.techStackURLs);
            }

            // Handle result pointers
            if (clientData.resultPointers) {
              const parsedPointers = JSON.parse(clientData.resultPointers);
              setValue("resultPointers", parsedPointers);
            }

            // Handle business process
            if (clientData.businessProcess) {
              const parsedProcess = JSON.parse(clientData.businessProcess);
              setValue("businessProcess", parsedProcess);
            }

            // Handle project goals
            if (clientData.projectGoals) {
              const parsedGoals = JSON.parse(clientData.projectGoals);
              setValue("projectGoals", parsedGoals);
            }

            // Handle optimization pointers
            if (clientData.optimizationPointers) {
              const parsedOptimization = JSON.parse(
                clientData.optimizationPointers
              );
              setValue("optimizationPointers", parsedOptimization);
            }

            // Store existing files in fileStorage
            const existingFiles = {
              brandVideo: clientData.brandVideoURL,
              brandImage: clientData.brandImageURL,
              brandLogo: clientData.brandLogoURL,
              solutionImage: clientData.solutionImgURL,
              clientImage: clientData.clientImgURL,
              projectGoalImg: clientData.projectGoalImgURL,
            };

            setFileStorage(existingFiles);
          }
        } catch (error) {
          console.error("Error fetching client data:", error);
          toast.error("Failed to fetch client data");
        }
      }
    };

    fetchClientData();
  }, [
    clientId,
    isEditMode,
    setValue,
    replaceAboutImg,
    replaceWireFrame,
    replacePrototype,
    replaceTechStack,
  ]);

  const onSubmit = async (data) => {
    try {
      console.log("Complete Form Data:", data);

      const formData = new FormData();

      // Helper function to append files from storage
      const appendStoredFile = (fieldName, formDataKey = fieldName) => {
        const file = fileStorage[fieldName];
        if (file) {
          formData.append(formDataKey, file);
        }
      };

      // Helper function to append multiple files with same name (no indices)
      const appendStoredFileArray = (fieldNamePrefix, count, formDataKey) => {
        for (let i = 0; i < count; i++) {
          const file = fileStorage[`${fieldNamePrefix}.${i}`];
          if (file) {
            formData.append(formDataKey, file); // Remove the [${i}] part
          }
        }
      };

      // Append text fields

      formData.append("brandName", data.brandName || "");
      formData.append("brandRGB", data.brandRGB || "");
      formData.append("brandVideoTitle", data.brandVideoTitle || "");
      formData.append("brandIndustry", data.brandIndustry || "");
      formData.append("brandServices", data.brandServices || "");
      formData.append("brandType", data.brandType || "");
      formData.append("brandAboutDesc", data.brandAboutDesc || "");
      formData.append("solutionTitle", data.solutionTitle || "");
      formData.append("solutionDesc", data.solutionDesc || "");
      formData.append("clientName", data.clientName || "");
      formData.append("clientDesignation", data.clientDesignation || "");
      formData.append("clientTestimonial", data.clientTestimonial || "");
      formData.append("resultTitle", data.resultTitle || "");
      formData.append("techStackTitle", data.techStackTitle || "");
      formData.append("optimizationTitle", data.optimizationTitle || "");
      formData.append("optimizationDesc", data.optimizationDesc || "");

      // Add productType field
      formData.append("productType", projectType === "Web" ? "web" : "mobile");

      // Append single files
      appendStoredFile("brandVideo");
      appendStoredFile("brandImage");
      appendStoredFile("brandLogo");
      appendStoredFile("solutionImage");
      appendStoredFile("clientImage");
      appendStoredFile("projectGoalImg", "projectGoalImage");

      // Append file arrays with same field names (no indices)
      const aboutImgCount = projectType === "Web" ? 2 : 4;
      appendStoredFileArray("aboutImages", aboutImgCount, "aboutImages");

      const wireframeCount = projectType === "Web" ? 2 : 5;
      appendStoredFileArray(
        "wireFrameImages",
        wireframeCount,
        "wireFrameImages"
      );

      const prototypeCount = projectType === "Web" ? 2 : 5;
      appendStoredFileArray(
        "prototypeImages",
        prototypeCount,
        "prototypeImages"
      );

      // Tech stack images - same field name for all
      for (let i = 0; i < techStackFields.length; i++) {
        const file = fileStorage[`techstackImages.${i}`];
        if (file) {
          formData.append(`techstackImages`, file); // Keep as is, this was already correct
        }
      }

      // Fix businessProcess structure - change description to desc
      const businessProcessData = data.businessProcess.map(
        (process, index) => ({
          id: index + 1,
          title: process.title,
          desc: process.description, // Changed from description to desc
        })
      );
      formData.append("businessProcess", JSON.stringify(businessProcessData));

      // Fix projectGoals structure - change description to desc
      const projectGoalsData = data.projectGoals.map((goal, index) => ({
        id: index + 1,
        title: goal.title,
        desc: goal.description, // Changed from description to desc
      }));
      formData.append("projectGoals", JSON.stringify(projectGoalsData));

      // Replace the static metrics with dynamic form data
      console.log("Original metrics data from form:", data.metrices);

      // Send each metric field separately
      formData.append("avgRatings", data.metrices.avgRatings || "");
      formData.append("conversionRate", data.metrices.conversionRate || "");
      formData.append("totalOrders", data.metrices.totalOrders || "");
      formData.append("repeatPurchases", data.metrices.repeatPurchases || "");
      formData.append(
        "orderFulfilledPerDay",
        data.metrices.orderFulfilledPerDay || ""
      );
      formData.append(
        "sessionRevenueUplift",
        data.metrices.sessionRevenueUplift || ""
      );

      // Log metrics data being sent
      console.log("Metrics data being sent:", {
        avgRatings: formData.get("avgRatings"),
        conversionRate: formData.get("conversionRate"),
        totalOrders: formData.get("totalOrders"),
        repeatPurchases: formData.get("repeatPurchases"),
        orderFulfilledPerDay: formData.get("orderFulfilledPerDay"),
        sessionRevenueUplift: formData.get("sessionRevenueUplift"),
      });

      // Result pointers
      const resultPointersData = data.resultPointers.map((pointer, index) => ({
        id: index + 1,
        title: pointer.title,
      }));
      formData.append("resultPointers", JSON.stringify(resultPointersData));

      // Result pointer images - same field name for all
      data.resultPointers.forEach((pointer, index) => {
        const file = fileStorage[`resultPointers.${index}.image`];
        if (file) {
          formData.append(`resultPointerImages`, file); // Remove indices
        }
      });

      // Optimization pointers - include description field
      const optimizationPointersData = data.optimizationPointers.map(
        (pointer, index) => ({
          id: index + 1,
          title: pointer.title,
          description: pointer.description, // Add description field
        })
      );
      formData.append(
        "optimizationPointers",
        JSON.stringify(optimizationPointersData)
      );

      // Optimization pointer images - same field name for all
      data.optimizationPointers.forEach((pointer, index) => {
        const file = fileStorage[`optimizationPointers.${index}.image`];
        if (file) {
          formData.append(`optimizationImages`, file);
        }
      });

      // Log FormData
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? `${value.name}` : value);
      }

      // Submit the form data to API
      if (isEditMode) {
        console.log(
          "Complete FormData being sent:",
          Object.fromEntries(formData)
        );
        await axiosHttp.put(`/clients/${clientId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Client updated successfully!");
      } else {
        console.log(
          "Complete FormData being sent:",
          Object.fromEntries(formData)
        );
        await axiosHttp.post("/clients/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Client added successfully!");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Error submitting form. Please try again.");
    }
  };

  const InputField = ({
    label,
    name,
    type = "text",
    required = false,
    className = "",
    ...props
  }) => (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          {...register(name, { required: required && `${label} is required` })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          {...props}
        />
      ) : type === "color" ? (
        <input
          type="color"
          {...register(name, { required: required && `${label} is required` })}
          className="w-full h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...props}
        />
      ) : (
        <input
          type={type}
          {...register(name, { required: required && `${label} is required` })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          {...props}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  );

  const FileInput = React.memo(
    ({ label, name, required = false, className = "" }) => {
      const storedFile = fileStorage[name];

      return (
        <div className={className}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="file"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleFileChange(name, files);
                // Register with react-hook-form for validation
                setValue(name, files[0]); // Pass the file object, not the FileList
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            accept={
              name.includes("Video") || name.includes("brandVideo")
                ? "video/*"
                : "image/*"
            }
          />
          {storedFile && (
            <p className="mt-1 text-xs text-green-600">
              Selected: {storedFile.name} (
              {(storedFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
          {errors[name] && (
            <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
          )}
        </div>
      );
    }
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Portfolio Project Form
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Project Type Selection */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Project Type <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="Web"
                {...register("projectType")}
                className="mr-2"
              />
              Web Project
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="App"
                {...register("projectType")}
                className="mr-2"
              />
              App Project
            </label>
          </div>
        </div>
        {/* Brand Media Section */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Brand Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput label="Brand Video" name="brandVideo" />
            <FileInput label="Brand Image" name="brandImage" />
            <InputField label="Brand Video Title" name="brandVideoTitle" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand RGB Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  {...register("brandRGB")}
                  className="w-16 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  {...register("brandRGB")}
                  placeholder="#000000"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>
        {/* Business Info */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Business Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Brand Name" name="brandName" required />
            <InputField label="Brand Industry" name="brandIndustry" required />
            <InputField label="Brand Services" name="brandServices" required />
            <InputField label="Brand Type" name="brandType" required />
            <FileInput label="Brand Logo" name="brandLogo" required />
          </div>
        </section>
        {/* About Section */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            About Section
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <InputField
              label="Brand About Description"
              name="brandAboutDesc"
              type="textarea"
              required
            />
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                About Images ({projectType === "Web" ? "2" : "4"} images)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutImgFields.map((field, index) => (
                  <FileInput
                    key={field.id}
                    label={`About Image ${index + 1}`}
                    name={`aboutImages.${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Solution Section */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Solution Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput label="Solution Image" name="solutionImage" required />
            <InputField label="Solution Title" name="solutionTitle" required />
            <InputField
              label="Solution Description"
              name="solutionDesc"
              type="textarea"
              required
              className="md:col-span-2"
            />
          </div>
        </section>
        {/* Client Section */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Client Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput label="Client Image" name="clientImage" required />
            <InputField label="Client Name" name="clientName" required />
            <InputField
              label="Client Designation"
              name="clientDesignation"
              required
            />
            <InputField
              label="Client Testimonial"
              name="clientTestimonial"
              type="textarea"
              required
              className="md:col-span-2"
            />
          </div>
        </section>
        {/* Result Section */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Result Section
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <InputField label="Result Title" name="resultTitle" required />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-700">
                  Result Pointers (Min: 3, Max: 4)
                </h3>
                <button
                  type="button"
                  onClick={() => appendResultPointer({ title: "", image: "" })}
                  disabled={resultPointerFields.length >= 4}
                  className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Plus size={16} className="mr-1" />
                  Add Pointer
                </button>
              </div>
              {resultPointerFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md mb-4"
                >
                  <InputField
                    label={`Pointer ${index + 1} Title`}
                    name={`resultPointers.${index}.title`}
                    required
                  />
                  <FileInput
                    label={`Pointer ${index + 1} Image`}
                    name={`resultPointers.${index}.image`}
                    required
                  />
                  {resultPointerFields.length > 3 && (
                    <button
                      type="button"
                      onClick={() => removeResultPointer(index)}
                      className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 md:col-span-2 w-fit"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Business Process Section */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Business Process (4 Steps)
          </h2>
          <div className="space-y-4">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-md"
              >
                <InputField
                  label={`Step ${index + 1} Title`}
                  name={`businessProcess.${index}.title`}
                  required
                />
                <InputField
                  label={`Step ${index + 1} Category`}
                  name={`businessProcess.${index}.category`}
                  required
                />
                <InputField
                  label={`Step ${index + 1} Description`}
                  name={`businessProcess.${index}.description`}
                  type="textarea"
                  required
                />
              </div>
            ))}
          </div>
        </section>
        {/* Wireframes & Prototypes */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Wireframes & Prototypes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Wireframes ({projectType === "Web" ? "2" : "5"} files)
              </h3>
              <div className="space-y-3">
                {wireFrameFields.map((field, index) => (
                  <FileInput
                    key={field.id}
                    label={`Wireframe ${index + 1}`}
                    name={`wireFrameImages.${index}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">
                Prototypes ({projectType === "Web" ? "2" : "5"} files)
              </h3>
              <div className="space-y-3">
                {prototypeFields.map((field, index) => (
                  <FileInput
                    key={field.id}
                    label={`Prototype ${index + 1}`}
                    name={`prototypeImages.${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Tech Stack */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Tech Stack
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <InputField
              label="Tech Stack Title"
              name="techStackTitle"
              required
            />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-700">
                  Tech Stack Images (Min: 2, Max: 7)
                </h3>
                <button
                  type="button"
                  onClick={() => appendTechStackField("")}
                  disabled={techStackFields.length >= 7}
                  className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Plus size={16} className="mr-1" />
                  Add Image
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {techStackFields.map((field, index) => (
                  <div key={field.id} className="flex items-end gap-2">
                    <FileInput
                      label={`Tech Image ${index + 1}`}
                      name={`techstackImages.${index}`}
                      className="flex-1"
                    />
                    {techStackFields.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeTechStackField(index)}
                        className="flex items-center px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mb-6"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Project Goals */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Project Goals (4 Goals)
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <FileInput
              label="Project Goal Image"
              name="projectGoalImg"
              required
            />
            <div className="space-y-4">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md"
                >
                  <InputField
                    label={`Goal ${index + 1} Title`}
                    name={`projectGoals.${index}.title`}
                    required
                  />
                  <InputField
                    label={`Goal ${index + 1} Description`}
                    name={`projectGoals.${index}.description`}
                    type="textarea"
                    required
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Optimization Section */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Optimization Section
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <InputField
              label="Optimization Title"
              name="optimizationTitle"
              required
            />
            <InputField
              label="Optimization Description"
              name="optimizationDesc"
              type="textarea"
              required
            />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-700">
                  Optimization Pointers (Min: 3, Max: 4)
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    appendOptimization({
                      title: "",
                      description: "",
                      image: "",
                    })
                  }
                  disabled={optimizationFields.length >= 4}
                  className="flex items-center px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  <Plus size={16} className="mr-1" />
                  Add Pointer
                </button>
              </div>
              {optimizationFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 rounded-md mb-4"
                >
                  <InputField
                    label={`Pointer ${index + 1} Title`}
                    name={`optimizationPointers.${index}.title`}
                    required
                  />
                  <InputField
                    label={`Pointer ${index + 1} Description`}
                    name={`optimizationPointers.${index}.description`}
                    type="textarea"
                    required
                  />
                  <FileInput
                    label={`Pointer ${index + 1} Image`}
                    name={`optimizationPointers.${index}.image`}
                    required
                  />
                  {optimizationFields.length > 3 && (
                    <button
                      type="button"
                      onClick={() => removeOptimization(index)}
                      className="flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 md:col-span-3 w-fit"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Metrices Section */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Project Metrics
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md">
              <InputField
                label="Average Ratings"
                name="metrices.avgRatings"
                required
                placeholder="e.g., 4.9"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md">
              <InputField
                label="Conversion Rate"
                name="metrices.conversionRate"
                required
                placeholder="e.g., 22%"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md">
              <InputField
                label="Total Orders"
                name="metrices.totalOrders"
                required
                placeholder="e.g., 50%"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md">
              <InputField
                label="Repeat Purchases"
                name="metrices.repeatPurchases"
                required
                placeholder="e.g., 60%"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md">
              <InputField
                label="Orders Fulfilled Per Day"
                name="metrices.orderFulfilledPerDay"
                required
                placeholder="e.g., 30,000+"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md">
              <InputField
                label="Session Revenue Uplift"
                name="metrices.sessionRevenueUplift"
                required
                placeholder="e.g., 100%"
              />
            </div>
          </div>
        </section>
        {/* Submit Button */}

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit Portfolio
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddClientForm;
