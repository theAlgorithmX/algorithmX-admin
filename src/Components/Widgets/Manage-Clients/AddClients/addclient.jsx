import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import axiosHttp from "../../../../utils/httpConfig";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

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
  } = useForm({
    defaultValues: {
      productType: "Web",
      slug: "",
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
      aboutImages: ["", "", ""],
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
      wireFrameImages: ["", "", ""],
      prototypeImages: ["", "", ""],
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
        avgRatingsDescription: "",
        conversionRate: "",
        conversionRateDescription: "",
        totalOrders: "",
        totalOrdersDescription: "",
        repeatPurchases: "",
        repeatPurchasesDescription: "",
        orderFulfilledPerDay: "",
        orderFulfilledDescription: "",
        sessionRevenueUplift: "",
        sessionRevenueDescription: "",
      },
    },
  });

  const productType = watch("productType");

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
  // Store client data for edit mode
  const [clientData, setClientData] = React.useState(null);
  // Prevent fetch after successful submit
  const isMountedRef = React.useRef(true);

  // Update field arrays when product type changes
  React.useEffect(() => {
    // In edit mode with loaded clientData, do not auto-reset counts here;
    // the fetch handler will set and pad arrays to the correct lengths.
    if (isEditMode && clientData) return;
    if (productType === "Web") {
      replaceAboutImg(["", "", ""]);
      replaceWireFrame(["", "", ""]);
      replacePrototype(["", "", ""]);
    } else {
      replaceAboutImg(["", "", "", ""]);
      replaceWireFrame(["", "", "", "", ""]);
      replacePrototype(["", "", "", "", ""]);
    }
  }, [
    productType,
    replaceAboutImg,
    replaceWireFrame,
    replacePrototype,
    isEditMode,
    clientData,
  ]);

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

  // Cleanup mounted ref on unmount
  React.useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Fetch client data if in edit mode
  useEffect(() => {
    let isFetching = true;
    const fetchClientData = async () => {
      if (isEditMode && clientId && isMountedRef.current && isFetching) {
        try {
          const response = await axiosHttp.get(`/clients/${clientId}`);
          if (response?.status === 200 && isMountedRef.current && isFetching) {
            const clientData = response.data.data;
            setClientData(clientData); // Store client data in state

            setValue(
              "productType",
              clientData.productType === "web" ? "Web" : "App",
            );
            setValue("brandName", clientData.brandName || "");
            setValue("slug", clientData.slug || "");
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

            // Metrics
            if (clientData.metrices) {
              setValue(
                "metrices.avgRatings",
                clientData.metrices.avgRatings || "",
              );
              setValue(
                "metrices.avgRatingsDescription",
                clientData.metrices.avgRatingsDescription || "",
              );
              setValue(
                "metrices.conversionRate",
                clientData.metrices.conversionRate || "",
              );
              setValue(
                "metrices.conversionRateDescription",
                clientData.metrices.conversionRateDescription || "",
              );
              setValue(
                "metrices.totalOrders",
                clientData.metrices.totalOrders || "",
              );
              setValue(
                "metrices.totalOrdersDescription",
                clientData.metrices.totalOrdersDescription || "",
              );
              setValue(
                "metrices.repeatPurchases",
                clientData.metrices.repeatPurchases || "",
              );
              setValue(
                "metrices.repeatPurchasesDescription",
                clientData.metrices.repeatPurchasesDescription || "",
              );
              setValue(
                "metrices.orderFulfilledPerDay",
                clientData.metrices.orderFulfilledPerDay || "",
              );
              setValue(
                "metrices.orderFulfilledDescription",
                clientData.metrices.orderFulfilledDescription || "",
              );
              setValue(
                "metrices.sessionRevenueUplift",
                clientData.metrices.sessionRevenueUplift || "",
              );
              setValue(
                "metrices.sessionRevenueDescription",
                clientData.metrices.sessionRevenueDescription || "",
              );
            }

            // About Images (pad/truncate to required count based on product type)
            {
              const desiredAboutCount =
                clientData.productType === "web" ? 3 : 4;
              let urls = [];
              try {
                urls =
                  typeof clientData.aboutImgURLs === "string"
                    ? JSON.parse(clientData.aboutImgURLs)
                    : clientData.aboutImgURLs || [];
              } catch (e) {
                urls = [];
              }
              const slicedUrls = (Array.isArray(urls) ? urls : []).slice(
                0,
                desiredAboutCount,
              );
              const padded = [
                ...slicedUrls,
                ...Array(
                  Math.max(0, desiredAboutCount - slicedUrls.length),
                ).fill(""),
              ];
              if (isMountedRef.current) {
                replaceAboutImg(padded);
              }
            }
            // Wireframes (pad/truncate to required count based on product type)
            {
              const desiredWireframeCount =
                clientData.productType === "web" ? 3 : 5;
              let urls = [];
              try {
                urls =
                  typeof clientData.wireFrameURLs === "string"
                    ? JSON.parse(clientData.wireFrameURLs)
                    : clientData.wireFrameURLs || [];
              } catch (e) {
                urls = [];
              }
              const slicedUrls = (Array.isArray(urls) ? urls : []).slice(
                0,
                desiredWireframeCount,
              );
              const padded = [
                ...slicedUrls,
                ...Array(
                  Math.max(0, desiredWireframeCount - slicedUrls.length),
                ).fill(""),
              ];
              if (isMountedRef.current) {
                replaceWireFrame(padded);
              }
            }
            // Prototypes (pad/truncate to required count based on product type)
            {
              const desiredPrototypeCount =
                clientData.productType === "web" ? 3 : 5;
              let urls = [];
              try {
                urls =
                  typeof clientData.prototypeURLs === "string"
                    ? JSON.parse(clientData.prototypeURLs)
                    : clientData.prototypeURLs || [];
              } catch (e) {
                urls = [];
              }
              const slicedUrls = (Array.isArray(urls) ? urls : []).slice(
                0,
                desiredPrototypeCount,
              );
              const padded = [
                ...slicedUrls,
                ...Array(
                  Math.max(0, desiredPrototypeCount - slicedUrls.length),
                ).fill(""),
              ];
              if (isMountedRef.current) {
                replacePrototype(padded);
              }
            }
            // Tech stack images - parse if JSON string
            if (clientData.techStackURLs && isMountedRef.current) {
              let techUrls = clientData.techStackURLs;
              try {
                techUrls =
                  typeof clientData.techStackURLs === "string"
                    ? JSON.parse(clientData.techStackURLs)
                    : clientData.techStackURLs;
              } catch (e) {
                techUrls = [];
              }
              if (Array.isArray(techUrls)) {
                replaceTechStack(techUrls);
              }
            }

            // Result pointers (parse JSON)
            if (clientData.resultPointers) {
              let parsedPointers = [];
              try {
                parsedPointers = JSON.parse(clientData.resultPointers);
              } catch (e) {}
              setValue("resultPointers", parsedPointers);
            }

            // Business process (double-parse)
            if (clientData.businessProcess) {
              let parsedProcess = [];
              try {
                parsedProcess = JSON.parse(
                  typeof clientData.businessProcess === "string"
                    ? JSON.parse(clientData.businessProcess)
                    : clientData.businessProcess,
                );
              } catch (e) {
                try {
                  parsedProcess = JSON.parse(clientData.businessProcess);
                } catch (e2) {
                  parsedProcess = [];
                }
              }
              // Map desc to description and ensure category exists
              const mappedProcess = parsedProcess.map((step) => ({
                title: step.title || "",
                category: step.category || "", // fallback to empty string if not present
                description: step.desc || step.description || "",
              }));
              setValue("businessProcess", mappedProcess);
            }

            // Project goals (double-parse)
            if (clientData.projectGoals) {
              let parsedGoals = [];
              try {
                parsedGoals = JSON.parse(
                  typeof clientData.projectGoals === "string"
                    ? JSON.parse(clientData.projectGoals)
                    : clientData.projectGoals,
                );
              } catch (e) {
                try {
                  parsedGoals = JSON.parse(clientData.projectGoals);
                } catch (e2) {
                  parsedGoals = [];
                }
              }
              // Map desc to description
              const mappedGoals = parsedGoals.map((goal) => ({
                title: goal.title || "",
                description: goal.desc || goal.description || "",
              }));
              setValue("projectGoals", mappedGoals);
            }

            // Optimization pointers
            if (clientData.optimizationPointers) {
              let parsedOptimization = [];
              try {
                parsedOptimization = JSON.parse(
                  clientData.optimizationPointers,
                );
              } catch (e) {}
              setValue("optimizationPointers", parsedOptimization);
            }

            // Store existing files and image URLs for preview
            const existingFiles = {
              brandVideo: clientData.brandVideoURL,
              brandImage: clientData.brandImageURL,
              brandLogo: clientData.brandLogoURL,
              solutionImage: clientData.solutionImgURL,
              clientImage: clientData.clientImgURL,
              projectGoalImg: clientData.projectGoalImgURL,
            };
            // About images - parse if JSON string
            if (clientData.aboutImgURLs) {
              try {
                const aboutUrls =
                  typeof clientData.aboutImgURLs === "string"
                    ? JSON.parse(clientData.aboutImgURLs)
                    : clientData.aboutImgURLs;
                if (Array.isArray(aboutUrls)) {
                  aboutUrls.forEach((url, idx) => {
                    existingFiles[`aboutImages.${idx}`] = url;
                  });
                }
              } catch (e) {}
            }
            // Wireframes - parse if JSON string
            if (clientData.wireFrameURLs) {
              try {
                const wireframeUrls =
                  typeof clientData.wireFrameURLs === "string"
                    ? JSON.parse(clientData.wireFrameURLs)
                    : clientData.wireFrameURLs;
                if (Array.isArray(wireframeUrls)) {
                  wireframeUrls.forEach((url, idx) => {
                    existingFiles[`wireFrameImages.${idx}`] = url;
                  });
                }
              } catch (e) {}
            }
            // Prototypes - parse if JSON string
            if (clientData.prototypeURLs) {
              try {
                const prototypeUrls =
                  typeof clientData.prototypeURLs === "string"
                    ? JSON.parse(clientData.prototypeURLs)
                    : clientData.prototypeURLs;
                if (Array.isArray(prototypeUrls)) {
                  prototypeUrls.forEach((url, idx) => {
                    existingFiles[`prototypeImages.${idx}`] = url;
                  });
                }
              } catch (e) {}
            }
            // Tech stack images - parse if JSON string
            if (clientData.techStackURLs) {
              try {
                const techUrls =
                  typeof clientData.techStackURLs === "string"
                    ? JSON.parse(clientData.techStackURLs)
                    : clientData.techStackURLs;
                if (Array.isArray(techUrls)) {
                  techUrls.forEach((url, idx) => {
                    existingFiles[`techstackImages.${idx}`] = url;
                  });
                }
              } catch (e) {}
            }
            // Result pointer images - parse if JSON string
            if (clientData.resultPointers) {
              try {
                const pointers =
                  typeof clientData.resultPointers === "string"
                    ? JSON.parse(clientData.resultPointers)
                    : clientData.resultPointers;
                if (Array.isArray(pointers)) {
                  pointers.forEach((pointer, idx) => {
                    if (pointer.img) {
                      existingFiles[`resultPointers.${idx}.image`] =
                        pointer.img;
                    }
                  });
                }
              } catch (e) {}
            }
            // Optimization pointer images - parse if JSON string
            if (clientData.optimizationPointers) {
              try {
                const optimizations =
                  typeof clientData.optimizationPointers === "string"
                    ? JSON.parse(clientData.optimizationPointers)
                    : clientData.optimizationPointers;
                if (Array.isArray(optimizations)) {
                  optimizations.forEach((opt, idx) => {
                    if (opt.img) {
                      existingFiles[`optimizationPointers.${idx}.image`] =
                        opt.img;
                    }
                  });
                }
              } catch (e) {}
            }
            setFileStorage(existingFiles);
          }
        } catch (error) {
          if (isMountedRef.current && isFetching) {
            console.error("Error fetching client data:", error);
            toast.error("Failed to fetch client data");
          }
        }
      }
    };
    fetchClientData();
    return () => {
      isFetching = false;
    };
  }, [clientId, isEditMode]);

  const onSubmit = async (data) => {
    try {
      console.log("Complete Form Data:", data);
      const formData = new FormData();

      // Add slug to FormData
      formData.append("slug", data.slug || "");

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
          const stored = fileStorage[`${fieldNamePrefix}.${i}`];
          if (stored) {
            // If a new file is selected, append the File. Otherwise, in edit mode, append the existing URL string
            if (stored instanceof File) {
              formData.append(formDataKey, stored);
            } else if (
              isEditMode &&
              typeof stored === "string" &&
              stored.length > 0
            ) {
              formData.append(formDataKey, stored);
            }
          } else if (isEditMode) {
            // In edit mode, ensure we send placeholders for remaining slots using empty strings,
            // so backend can maintain positional mapping if required.
            formData.append(formDataKey, "");
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
      formData.append("productType", productType === "Web" ? "web" : "mobile");

      // Append single files
      appendStoredFile("brandVideo");
      appendStoredFile("brandImage");
      appendStoredFile("brandLogo");
      appendStoredFile("solutionImage");
      appendStoredFile("clientImage");
      appendStoredFile("projectGoalImg", "projectGoalImage");

      // Append file arrays with same field names (no indices)
      const aboutImgCount = productType === "Web" ? 3 : 4;
      appendStoredFileArray("aboutImages", aboutImgCount, "aboutImages");

      const wireframeCount = productType === "Web" ? 3 : 5;
      appendStoredFileArray(
        "wireFrameImages",
        wireframeCount,
        "wireFrameImages",
      );

      const prototypeCount = productType === "Web" ? 3 : 5;
      appendStoredFileArray(
        "prototypeImages",
        prototypeCount,
        "prototypeImages",
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
        }),
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
      formData.append(
        "avgRatingsDescription",
        data.metrices.avgRatingsDescription || "",
      );
      formData.append("conversionRate", data.metrices.conversionRate || "");
      formData.append(
        "conversionRateDescription",
        data.metrices.conversionRateDescription || "",
      );
      formData.append("totalOrders", data.metrices.totalOrders || "");
      formData.append(
        "totalOrdersDescription",
        data.metrices.totalOrdersDescription || "",
      );
      formData.append("repeatPurchases", data.metrices.repeatPurchases || "");
      formData.append(
        "repeatPurchasesDescription",
        data.metrices.repeatPurchasesDescription || "",
      );
      formData.append(
        "orderFulfilledPerDay",
        data.metrices.orderFulfilledPerDay || "",
      );
      formData.append(
        "orderFulfilledDescription",
        data.metrices.orderFulfilledDescription || "",
      );
      formData.append(
        "sessionRevenueUplift",
        data.metrices.sessionRevenueUplift || "",
      );
      formData.append(
        "sessionRevenueDescription",
        data.metrices.sessionRevenueDescription || "",
      );

      // Also send the full metrices object as JSON string
      const metricesObject = {
        avgRatings: data.metrices.avgRatings || "",
        avgRatingsDescription: data.metrices.avgRatingsDescription || "",
        conversionRate: data.metrices.conversionRate || "",
        conversionRateDescription:
          data.metrices.conversionRateDescription || "",
        totalOrders: data.metrices.totalOrders || "",
        totalOrdersDescription: data.metrices.totalOrdersDescription || "",
        repeatPurchases: data.metrices.repeatPurchases || "",
        repeatPurchasesDescription:
          data.metrices.repeatPurchasesDescription || "",
        orderFulfilledPerDay: data.metrices.orderFulfilledPerDay || "",
        orderFulfilledDescription:
          data.metrices.orderFulfilledDescription || "",
        sessionRevenueUplift: data.metrices.sessionRevenueUplift || "",
        sessionRevenueDescription:
          data.metrices.sessionRevenueDescription || "",
      };

      // In edit mode, include the id
      if (isEditMode && clientData?.metricesId) {
        metricesObject.id = clientData.metricesId;
      }

      formData.append("metrices", JSON.stringify(metricesObject));

      // In edit mode, also send metricesId
      if (isEditMode && clientData?.metricesId) {
        formData.append("metricesId", clientData.metricesId);
      }

      // Log metrics data being sent
      console.log("Metrics data being sent:", {
        avgRatings: formData.get("avgRatings"),
        avgRatingsDescription: formData.get("avgRatingsDescription"),
        conversionRate: formData.get("conversionRate"),
        conversionRateDescription: formData.get("conversionRateDescription"),
        totalOrders: formData.get("totalOrders"),
        totalOrdersDescription: formData.get("totalOrdersDescription"),
        repeatPurchases: formData.get("repeatPurchases"),
        repeatPurchasesDescription: formData.get("repeatPurchasesDescription"),
        orderFulfilledPerDay: formData.get("orderFulfilledPerDay"),
        orderFulfilledDescription: formData.get("orderFulfilledDescription"),
        sessionRevenueUplift: formData.get("sessionRevenueUplift"),
        sessionRevenueDescription: formData.get("sessionRevenueDescription"),
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
        }),
      );
      formData.append(
        "optimizationPointers",
        JSON.stringify(optimizationPointersData),
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
          Object.fromEntries(formData),
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
          Object.fromEntries(formData),
        );
        await axiosHttp.post("/clients/", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Client added successfully!");
      }
    } catch (error) {
      console.error("Error details:", error);

      // Handle different types of error responses
      let errorMessage = "An error occurred while processing your request";

      if (error.response) {
        // Server responded with error status
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.message) {
        // Something else happened
        errorMessage = error.message;
      }

      toast.error(errorMessage);
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
      <label className="block text-sm font-medium text-white mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          {...register(name, { required: required && `${label} is required` })}
          className="w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
          rows={4}
          {...props}
        />
      ) : type === "color" ? (
        <input
          type="color"
          {...register(name, { required: required && `${label} is required` })}
          className="w-full h-10 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/10 backdrop-blur-sm"
          {...props}
        />
      ) : (
        <input
          type={type}
          {...register(name, { required: required && `${label} is required` })}
          className="w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/10 backdrop-blur-sm text-white placeholder-white/70"
          {...props}
        />
      )}
      {errors[name] && (
        <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
      )}
    </div>
  );

  const FileInput = React.memo(
    ({ label, name, required = false, className = "", existingUrl }) => {
      const storedFile = fileStorage[name];
      // Determine if storedFile is a File or a URL string
      const isFileObj = storedFile && typeof storedFile !== "string";
      const previewUrl = isFileObj
        ? URL.createObjectURL(storedFile)
        : storedFile || existingUrl;

      // Determine file type for preview
      const isVideo = (url) => {
        if (typeof url === "string") {
          return (
            url.includes(".mp4") ||
            url.includes(".mov") ||
            url.includes(".avi") ||
            url.includes(".webm")
          );
        }
        return false;
      };

      return (
        <div className={className}>
          <label className="block text-sm font-medium text-white mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <input
            type="file"
            onChange={(e) => {
              const files = e.target.files;
              if (files && files.length > 0) {
                handleFileChange(name, files);
                setValue(name, files[0]);
              }
            }}
            className="w-full px-3 py-2 border border-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent      text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-white/20 file:text-white file:backdrop-blur-sm file:border-white/20"
            accept={
              name.includes("brandVideo")
                ? "image/*,video/*"
                : name.includes("Video")
                  ? "video/*"
                  : "image/*"
            }
          />
          {/* Preview for existing or selected file */}
          {previewUrl && (
            <div className="mt-1">
              {isVideo(previewUrl) ? (
                <video
                  src={previewUrl}
                  controls
                  style={{ maxWidth: 100, maxHeight: 100 }}
                />
              ) : (
                <img
                  src={previewUrl}
                  alt={label}
                  style={{ maxWidth: 100, maxHeight: 100 }}
                />
              )}
              <p className="text-xs text-gray-500">Current file</p>
            </div>
          )}
          {errors[name] && (
            <p className="mt-1 text-sm text-red-600">{errors[name].message}</p>
          )}
        </div>
      );
    },
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-8">
        Portfolio Project Form
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Product Type Selection */}
        <div className="bg-white/10 shadow-lg shadow-black/10 backdrop-blur-sm   p-4 rounded-lg">
          <label className="block text-sm font-medium text-white mb-3 text-white">
            Product Type <span className="text-red-500">*</span>
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center text-white">
              <input
                type="radio"
                value="Web"
                {...register("productType")}
                className="mr-2 text-white"
              />
              Web Project
            </label>
            <label className="flex items-center text-white">
              <input
                type="radio"
                value="App"
                {...register("productType")}
                className="mr-2 text-white"
              />
              App Project
            </label>
          </div>
        </div>
        {/* Brand Media Section */}
        <section className=" p-6 rounded-lg">
          <h2 className="text-xl font-semibold  text-white mb-4">
            Brand Media
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput
              label="Brand Video & Images both allowed upload any one"
              name="brandVideo"
              existingUrl={fileStorage.brandVideo}
            />
            <FileInput
              label="Brand Image"
              name="brandImage"
              existingUrl={fileStorage.brandImage}
            />
            <InputField label="Brand Video Title" name="brandVideoTitle" />
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Brand RGB Color
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  {...register("brandRGB")}
                  onChange={(e) => {
                    setValue("brandRGB", e.target.value);
                  }}
                  className="w-16 h-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  {...register("brandRGB")}
                  placeholder="#000000"
                  onChange={(e) => {
                    setValue("brandRGB", e.target.value);
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </section>
        {/* Business Info */}
        <section className="C   p-6 rounded-lg">
          <h2 className="text-xl font-semibold  text-white mb-4">
            Business Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField label="Brand Name" name="brandName" required />
            <InputField label="URL Slug" name="slug" required placeholder="" />
            <InputField label="Brand Industry" name="brandIndustry" required />
            <InputField label="Brand Services" name="brandServices" required />
            <InputField label="Brand Type" name="brandType" required />
            <FileInput
              label="Brand Logo"
              name="brandLogo"
              required
              existingUrl={fileStorage.brandLogo}
            />
          </div>
        </section>
        {/* About Section */}
        <section className="     p-6 rounded-lg">
          <h2 className="text-xl font-semibold  text-white mb-4">
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
              <h3 className="text-lg font-medium text-white mb-3">
                About Images ({productType === "Web" ? "3" : "4"} images)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutImgFields.map((field, index) => (
                  <FileInput
                    key={field.id}
                    label={`About Image ${index + 1}`}
                    name={`aboutImages.${index}`}
                    existingUrl={fileStorage[`aboutImages.${index}`]}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Solution Section */}
        <section className="      p-6 rounded-lg">
          <h2 className="text-xl font-semibold  text-white mb-4">
            Solution Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput
              label="Solution Image"
              name="solutionImage"
              required
              existingUrl={fileStorage.solutionImage}
            />
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
        <section className="      p-6 rounded-lg">
          <h2 className="text-xl font-semibold  text-white mb-4">
            Client Section
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileInput
              label="Client Image"
              name="clientImage"
              required
              existingUrl={fileStorage.clientImage}
            />
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
        <section className="      p-6 rounded-lg">
          <h2 className="text-xl font-semibold  text-white mb-4">
            Result Section
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <InputField label="Result Title" name="resultTitle" required />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-white">
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
                    existingUrl={fileStorage[`resultPointers.${index}.image`]}
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
        <section className="      p-6 rounded-lg">
          <h2 className="text-xl font-semibold  text-white mb-4">
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
                />
                <InputField
                  label={`Step ${index + 1} Category`}
                  name={`businessProcess.${index}.category`}
                />
                <InputField
                  label={`Step ${index + 1} Description`}
                  name={`businessProcess.${index}.description`}
                  type="textarea"
                />
              </div>
            ))}
          </div>
        </section>
        {/* Wireframes & Prototypes */}
        <section className="      p-6 rounded-lg">
          <h2 className="text-xl font-semibold  text-white mb-4">
            Wireframes & Prototypes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                Wireframes ({productType === "Web" ? "3" : "5"} files)
              </h3>
              <div className="space-y-3">
                {wireFrameFields.map((field, index) => (
                  <FileInput
                    key={field.id}
                    label={`Wireframe ${index + 1}`}
                    name={`wireFrameImages.${index}`}
                    existingUrl={fileStorage[`wireFrameImages.${index}`]}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-3">
                Prototypes ({productType === "Web" ? "3" : "5"} files)
              </h3>
              <div className="space-y-3">
                {prototypeFields.map((field, index) => (
                  <FileInput
                    key={field.id}
                    label={`Prototype ${index + 1}`}
                    name={`prototypeImages.${index}`}
                    existingUrl={fileStorage[`prototypeImages.${index}`]}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
        {/* Tech Stack */}
        <section className="      p-6 rounded-lg">
          <h2 className="text-xl font-semibold  text-white mb-4">Tech Stack</h2>
          <div className="grid grid-cols-1 gap-6">
            <InputField
              label="Tech Stack Title"
              name="techStackTitle"
              required
            />
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-white">
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
                      existingUrl={fileStorage[`techstackImages.${index}`]}
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
        <section className="      p-6 rounded-lg">
          <h2 className="text-xl font-semibold  text-white mb-4">
            Project Goals (4 Goals)
          </h2>
          <div className="grid grid-cols-1 gap-6">
            <FileInput
              label="Project Goal Image"
              name="projectGoalImg"
              required
              existingUrl={fileStorage.projectGoalImg}
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
        <section className="      p-6 rounded-lg">
          <h2 className="text-xl font-semibold  text-white mb-4">
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
                <h3 className="text-lg font-medium text-white">
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
                    existingUrl={
                      fileStorage[`optimizationPointers.${index}.image`]
                    }
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
        <section className="      p-6 rounded-lg">
          <h2 className="text-xl font-semibold  text-white mb-4">
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
              <InputField
                label="Average Ratings Description"
                name="metrices.avgRatingsDescription"
                type="textarea"
                placeholder="Describe the ratings context"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md">
              <InputField
                label="Conversion Rate"
                name="metrices.conversionRate"
                required
                placeholder="e.g., 22%"
              />
              <InputField
                label="Conversion Rate Description"
                name="metrices.conversionRateDescription"
                type="textarea"
                placeholder="Describe how conversion rate was measured"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md">
              <InputField
                label="Total Orders"
                name="metrices.totalOrders"
                required
                placeholder="e.g., 50%"
              />
              <InputField
                label="Total Orders Description"
                name="metrices.totalOrdersDescription"
                type="textarea"
                placeholder="Describe timeframe and scope for orders"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md">
              <InputField
                label="Repeat Purchases"
                name="metrices.repeatPurchases"
                required
                placeholder="e.g., 60%"
              />
              <InputField
                label="Repeat Purchases Description"
                name="metrices.repeatPurchasesDescription"
                type="textarea"
                placeholder="Add details about repeat customer behavior"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md">
              <InputField
                label="Orders Fulfilled Per Day"
                name="metrices.orderFulfilledPerDay"
                required
                placeholder="e.g., 30,000+"
              />
              <InputField
                label="Orders Fulfilled Per Day Description"
                name="metrices.orderFulfilledDescription"
                type="textarea"
                placeholder="Explain fulfillment capacity and assumptions"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-md">
              <InputField
                label="Session Revenue Uplift"
                name="metrices.sessionRevenueUplift"
                required
                placeholder="e.g., 100%"
              />
              <InputField
                label="Session Revenue Uplift Description"
                name="metrices.sessionRevenueDescription"
                type="textarea"
                placeholder="Describe experiment or comparison baseline"
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
