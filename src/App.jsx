import React, { useState, useEffect } from "react";
import { GiPotionBall } from "react-icons/gi";
import { HiRefresh } from "react-icons/hi";
import Load from "./Load";
import { toast } from "react-toastify";

const SearchPage = () => {
  const [query, setQuery] = useState("nike");
  const [country, setCountry] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [owners,setOwners]=useState([]);
  const [selectedOwners, setSelectedOwners] = useState([]);
  const [selectedAttorneys, setSelectedAttorneys] = useState([]);
  const [selectedLawFirms, setSelectedLawFirms] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [view, setView] = useState(true);

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    const requestBody = {
      input_query: query,
      sort_by: "default",
      status: selectedStatus ? [selectedStatus] : [],
      country: country ? [country] : [],
      owners: selectedOwners,
      attorneys: selectedAttorneys,
      law_firms: selectedLawFirms,
      page: 1,
      rows: 10,
      sort_order: "desc",
    };

    try {
      const res = await fetch(
        "https://vit-tm-task.api.trademarkia.app/api/v3/us",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      console.log(data);
      setResults(data);
      // setOwners(results?.body?.aggregations?.current_owners?.buckets)
    } catch (err) {
      setError(err.message);
      toast.error(`Error:${err.message}`,
        {position:"top-right",
          autoClose:1400
        }
      )
    } finally {
      setLoading(false);
    }
  };

  // Handlers for checkboxes
  const handleCheckboxChange = (setState) => (e) => {
    const value = e.target.value;
    setState((prev) =>
      e.target.checked
        ? [...prev, value]
        : prev.filter((item) => item !== value)
    );
  };

  // Auto-update on checkbox or country change
  useEffect(() => {
    // if (results?.body?.aggregations?.current_owners?.buckets) {
    //   setOwners(results.body.aggregations.current_owners.buckets);
    // }
    if (
      selectedOwners.length ||
      selectedAttorneys.length ||
      selectedLawFirms.length ||
      country ||
      selectedStatus.length
    ) {
      handleSearch();
    }
    // handleSearch();
  }, [
    selectedOwners,
    selectedAttorneys,
    selectedLawFirms,
    country,
    selectedStatus,
  ]);
  window.onload=()=>{
    handleSearch();
  }

  return (
    <div className=" p-4">
      <header className=" mb-8 flex flex-row items-center   ">
        <div>
          <img
            src="https://www.trademarkia.com/_next/image?url=%2Fassets%2Fimages%2Flogo_trademarkia.png&w=384&q=75"
            alt=""
            width={250}
          />
        </div>
        <div className="w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className="mt-4 flex justify-center gap-x-5"
          >
            <input
              type="text"
              placeholder="Search trademarks..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-[60%] px-4 py-2 border border-gray-300 rounded-full focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
            >
              Search
            </button>
          </form>
        </div>
      </header>
      <hr className="border-2 border-blue-200" />
      <br />

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="w-64 border-r border-gray-200 pr-4 space-y-6">
          {/* Country Dropdown */}
          <div className="flex items-center border border-grey-300 p-5 rounded-xl hover:border-blue-200 gap-8">
            <label htmlFor="country" className="block mb-1 font-bold">
              Country
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="US">US</option>
              <option value="DE">DE</option>
              <option value="FR">FR</option>
            </select>
          </div>

          {/* Status Button Group - FIXED CSS */}
          <div>
            <label className="block mb-1 font-bold ">Status</label>
            <div className="flex flex-wrap gap-2">
              {["", "registered", "abandoned", "other", "pending"].map(
                (status) => (
                  <button
                    key={status || "all"}
                    onClick={() => setSelectedStatus(status)}
                    className={`px-4 py-2 border rounded-md ${selectedStatus === status
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700"
                      } flex items-center gap-1`}
                  >
                    <div
                      className={`h-4 w-4 rounded-full
                      ${status == "registered" ? "bg-green-500" : ""}
                      ${status == "abandoned" ? "bg-red-600" : ""}
                      ${status == "pending" ? "bg-yellow-400" : ""}
                      ${status == "other" ? "bg-blue-400" : ""}
                      ${status == "" ? "h-0 w-0" : ""}
                      `}
                    ></div>
                    {status === ""
                      ? "All"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Owners Checkboxes */}
          <div className="overflow-auto max-h-64 border-2 border-gray-300 p-4 rounded-md">
            <label className="block mb-1 font-medium">Owners</label>
            {results?.body?.aggregations?.current_owners?.buckets?.map(
              (bucket) => (
                <div key={bucket.key} className="flex items-center min-w-max">
                  <input
                    type="checkbox"
                    value={bucket.key}
                    onChange={handleCheckboxChange(setSelectedOwners)}
                    className="mr-2"
                  />
                  <label className="text-sm">
                    {bucket.key} ({bucket.doc_count})
                  </label>
                </div>
              )
            )}
          </div>

          {/* Attorneys Checkboxes */}
          <div className="overflow-auto max-h-64 border-2 border-gray-300 p-4 rounded-md">
            <label className="block mb-1 font-medium">Attorneys</label>
            {results?.body?.aggregations?.attorneys?.buckets?.map((bucket) => (
              <div key={bucket.key} className="flex items-center min-w-52">
                <input
                  type="checkbox"
                  value={bucket.key}
                  onChange={handleCheckboxChange(setSelectedAttorneys)}
                  className="mr-2"
                />
                <label className="text-sm">
                  {bucket.key} ({bucket.doc_count})
                </label>
              </div>
            ))}
          </div>

          {/* Law Firms Checkboxes */}
          <div className="overflow-auto max-h-60 border-2 border-gray-300 p-4  rounded-md ">
            <label className="block mb-1 font-medium">Law Firms</label>
            {results?.body?.aggregations?.law_firms?.buckets?.map((bucket) => (
              <div key={bucket.key} className="flex items-center min-w-max ">
                <input
                  type="checkbox"
                  value={bucket.key}
                  onChange={handleCheckboxChange(setSelectedLawFirms)}
                  className="mr-2"
                />
                <label className="text-sm">
                  {bucket.key} ({bucket.doc_count})
                </label>
              </div>
            ))}
          </div>

          {/* view buttons */}
          <div className="border-2  border-grey-200 p-4 flex gap-2 rounded-xl hover:border-blue-300">
            <button
              className={`p-2 border rounded-xl font-semibold ${view ? "bg-blue-300" : ""}`}
              onClick={() => setView(!view)}
            >
              List View
            </button>
            <button
              className={`p-2 border rounded-xl font-semibold ${!view ? "bg-blue-300" : ""}`}

              onClick={() => setView(!view)}
            >
              Grid View
            </button>
          </div>
        </aside>

        {/* Results Section */}
        {view && (
          <section className="flex-1 ">
            {loading && <p className="flex justify-center items-center "><Load className="" /><span className="text-3xl">.......</span></p>}
            {/* {error && <p className="text-center text-red-500">{error}</p>} */}
            {results?.body?.hits?.hits?.length > 0 ? (
              <div className="space-y-4 w-full">
                <table className="w-full">
                  <thead className="w-full">
                    <tr className="grid lg:grid-cols-4 w-full text-xl">
                      <th className="">Mark</th>
                      <th>Details</th>
                      <th>Status</th>
                      <th>Class/Description</th>
                    </tr>
                  </thead>
                </table>
                {results.body.hits.hits.map((item, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-md grid lg:grid-cols-4  w-full shadow-[0px_10px_50px_10px_#bee3f8]  hover:shadow-[inset_-12px_-8px_40px_#46464620]"
                  >
                    <div className="w-[55%] m-auto">
                      <h3 className="text-lg font-semibold p-10 border-2 text-center ">
                        {item._source?.mark_identification.slice(0, 4) || "N/A"}
                      </h3>
                    </div>
                    <div className="text-center">
                      <strong>
                        {item._source?.mark_identification || "N/A"}
                      </strong>

                      <p>{item._source?.current_owner || "N/A"}</p>
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-lg  font-semibold 
                      ${item._source?.status_type == "registered"
                            ? "text-green-400"
                            : ""
                          }
                      ${item._source?.status_type == "abandoned"
                            ? "text-red-500"
                            : ""
                          }
                      ${item._source?.status_type == "pending"
                            ? "text-yellow-400"
                            : ""
                          }
                      ${item._source?.status_type == "other"
                            ? "text-blue-300"
                            : ""
                          }
                      `}
                      >
                        {item._source?.status_type || "N/A"}
                        <br />
                        <span className="text-black font-semibold text-sm">
                          {" "}
                          {formatDate(item._source?.registration_date)}
                        </span>
                      </p>
                    </div>
                    {/* <p>
                    <strong>Law Firm:</strong> {item._source?.law_firm || "N/A"}
                  </p>
                  <p>
                    <strong>Attorney:</strong>{" "}
                    {item._source?.attorney_name || "N/A"}
                  </p>
                  <p>
                    <strong>Current Owner:</strong>{" "}
                    {item._source?.current_owner || "N/A"}
                  </p> */}
                    <div>
                      <div>
                        <p>
                          {item._source?.mark_description_description
                            .slice(0, 1)
                            .map((itemmark) => {
                              return <>{itemmark.slice(0, 50)}</>;
                            })}
                        </p>
                      </div>
                      <div>
                        <p className="flex gap-2">
                          {item._source.class_codes.length < 3
                            ? item._source.class_codes.map((itemc) => {
                              return (
                                <>
                                  <p className="flex items-center gap-2">
                                    {" "}
                                    <GiPotionBall /> class {itemc}
                                  </p>
                                </>
                              );
                            })
                            : item._source.class_codes
                              .slice(0, 3)
                              .map((itemc) => {
                                return (
                                  <>
                                    <p className="flex items-center gap-2">
                                      {" "}
                                      <GiPotionBall /> class {itemc}
                                    </p>
                                  </>
                                );
                              })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <p className="text-center">No search results found.</p>
              )
            )}
          </section>
        )}
        {!view && (
          <section className="flex-1 ">
            {loading && <p className="flex justify-center items-center "><Load className="" /><span className="text-3xl">.......</span></p>}
            {/* {error && <p className="text-center text-red-500">{error}</p>} */}
            {results?.body?.hits?.hits?.length > 0 ? (
              <div className="w-full grid lg:grid-cols-3 md:grid-cols-2 sm-grid-cols-1  gap-5 ">
                {results.body.hits.hits.map((item, index) => (
                  <div className="border-2 border-grey-400 p-4 py-8 shadow-[inset_0px_10px_50px_0px_#bee3f8] hover:shadow-[0px_4px_16px_rgba(17,17,26,0.1),_0px_8px_24px_rgba(17,17,26,0.1),_0px_16px_56px_rgba(17,17,26,0.1)]">
                    <div className="flex flex-row justify-between px-12 items-center">
                      <div>
                        <h3 className="text-2xl font-semibold  font-serif text-center ">
                          {item._source?.mark_identification.slice(0, 4) ||
                            "N/A"}
                        </h3>
                      </div>
                      <div>
                        <p
                          className={`text-sm  font-semibold 
                      ${item._source?.status_type == "registered"
                              ? "text-green-400"
                              : ""
                            }
                      ${item._source?.status_type == "abandoned"
                              ? "text-red-500"
                              : ""
                            }
                      ${item._source?.status_type == "pending"
                              ? "text-yellow-400"
                              : ""
                            }
                      ${item._source?.status_type == "other"
                              ? "text-blue-300"
                              : ""
                            }
                      `}
                        >
                          {item._source?.status_type || "N/A"}
                          <br />
                          <span className="text-black font-semibold text-sm">
                            {" "}
                            {formatDate(item._source?.registration_date)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-5">
                      <h3 className="text-lg font-semibold   ">
                        {item._source?.mark_identification.slice(0, 4) || "N/A"}
                      </h3>
                      <p className="text-sm">
                        {item._source?.current_owner || "N/A"}
                      </p>
                    </div>
                    <div className="flex fex-row items-center justify-between">
                      <div className="flex gap-2">
                        <p className="text-sm">
                          <small>{item?._id}</small>
                        </p>
                        <p className="text-sm">
                          <small>
                            {formatDate(item._source?.registration_date)}
                          </small>
                        </p>
                      </div>
                      <div>
                        <p className="flex items-center gap-1"><small className="text-red-500"><HiRefresh /></small><small>{formatDate(item._source?.renewal_date)}</small></p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="flex gap-4">
                        {item._source.class_codes.length < 3
                          ? item._source.class_codes.map((itemc) => {
                            return (
                              <>
                                <p className="flex items-center gap-1">
                                  {" "}
                                  <GiPotionBall /> <small>{itemc}</small>
                                </p>
                              </>
                            );
                          })
                          : item._source.class_codes
                            .slice(0, 3)
                            .map((itemc) => {
                              return (
                                <>
                                  <p className="flex items-center gap-1">
                                    {" "}
                                    <GiPotionBall />  <small>{itemc}</small>
                                  </p>
                                </>
                              );
                            })}
                      </p>

                    </div>
                    <div className="mt-3 leading-none">
                      <p>
                        {item._source?.mark_description_description
                          .slice(0, 1)
                          .map((itemmark) => {
                            return <><small>{itemmark.slice(0, 50)}</small></>;
                          })}
                      </p>
                    </div>
                    <br />
                    <div className="">
                      <button className="border-2 border-blue-300 px-5 py-2 rounded-lg font-semibold ">View</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !loading && (
                <p className="text-center">No search results found.</p>
              )
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
