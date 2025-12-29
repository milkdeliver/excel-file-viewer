"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {
  const [data, setData] = useState<string[][]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [templateData, setTemplateData] = useState<string[][]>([]);
  const [templateFileName, setTemplateFileName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [mappedData, setMappedData] = useState<string[][]>([]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, {
        header: 1,
        defval: "",
      });

      setData(jsonData);
      setFileName(file.name);
      setMappedData([]);
    } catch (err) {
      setError("Failed to parse Excel file. Please ensure it's a valid Excel file.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json<string[]>(worksheet, {
        header: 1,
        defval: "",
      });

      setTemplateData(jsonData);
      setTemplateFileName(file.name);
      setMappedData([]);
    } catch (err) {
      setError("Failed to parse template file. Please ensure it's a valid Excel file.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMapData = () => {
    if (data.length === 0 || templateData.length === 0) {
      setError("Please upload both source data and template files.");
      return;
    }

    try {
      const sourceHeaders = data[0] || [];
      const templateHeaders = templateData[0] || [];
      
      const headerMap: { [key: string]: number } = {};
      sourceHeaders.forEach((header, index) => {
        headerMap[String(header).trim().toLowerCase()] = index;
      });

      const result: string[][] = [templateHeaders];

      for (let i = 1; i < data.length; i++) {
        const sourceRow = data[i];
        const newRow: string[] = new Array(templateHeaders.length).fill("");

        templateHeaders.forEach((templateHeader, templateIndex) => {
          const headerKey = String(templateHeader).trim().toLowerCase();
          const sourceIndex = headerMap[headerKey];
          
          if (sourceIndex !== undefined && sourceRow[sourceIndex] !== undefined) {
            newRow[templateIndex] = String(sourceRow[sourceIndex]);
          }
        });

        result.push(newRow);
      }

      setMappedData(result);
      setError("");
    } catch (err) {
      setError("Failed to map data. Please check your files.");
      console.error(err);
    }
  };

  const handleDownload = () => {
    if (mappedData.length === 0) {
      setError("No mapped data to download. Please map data first.");
      return;
    }

    try {
      const worksheet = XLSX.utils.aoa_to_sheet(mappedData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Mapped Data");
      
      XLSX.writeFile(workbook, "mapped_data.xlsx");
    } catch (err) {
      setError("Failed to download file.");
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Excel File Viewer
          </h1>
          <p className="text-gray-600 mb-6">
            Upload an Excel file to view its contents in a table
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                1. Upload Source Data
              </h2>
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full px-6 py-4 border-2 border-dashed border-indigo-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors bg-indigo-50 hover:bg-indigo-100"
              >
                <div className="text-center">
                  <svg
                    className="mx-auto h-10 w-10 text-indigo-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-indigo-600">
                      Upload Source
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Excel files (.xlsx, .xls, .csv)
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
              </label>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                2. Upload Template
              </h2>
              <label
                htmlFor="template-upload"
                className="flex items-center justify-center w-full px-6 py-4 border-2 border-dashed border-green-300 rounded-lg cursor-pointer hover:border-green-500 transition-colors bg-green-50 hover:bg-green-100"
              >
                <div className="text-center">
                  <svg
                    className="mx-auto h-10 w-10 text-green-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                  >
                    <path
                      d="M9 12h6m-6 4h6m-6 4h6m-6 4h6M9 28h6m12-16h6m-6 4h6m-6 4h6m-6 4h6m-6 4h6m-4-26v28m-8-28v28"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-green-600">
                      Upload Template
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Template with headers
                  </p>
                </div>
                <input
                  id="template-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleTemplateUpload}
                  disabled={loading}
                />
              </label>
            </div>
          </div>

          {(fileName || templateFileName) && (
            <div className="mb-6 flex flex-col md:flex-row gap-4 justify-center items-center">
              {fileName && templateFileName && (
                <button
                  onClick={handleMapData}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md hover:shadow-lg"
                >
                  3. Map Data
                </button>
              )}
              {mappedData.length > 0 && (
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  4. Download Result
                </button>
              )}
            </div>
          )}

          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              <span className="ml-3 text-gray-600">Loading...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {(fileName || templateFileName) && !loading && (
            <div className="mb-4 space-y-2">
              {fileName && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="h-5 w-5 mr-2 text-indigo-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">Source:</span>
                  <span className="ml-2">{fileName}</span>
                  <span className="ml-4 text-gray-500">
                    ({data.length} rows × {data[0]?.length || 0} columns)
                  </span>
                </div>
              )}
              {templateFileName && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="h-5 w-5 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">Template:</span>
                  <span className="ml-2">{templateFileName}</span>
                  <span className="ml-4 text-gray-500">
                    ({templateData.length} rows × {templateData[0]?.length || 0} columns)
                  </span>
                </div>
              )}
              {mappedData.length > 0 && (
                <div className="flex items-center text-sm text-gray-600">
                  <svg
                    className="h-5 w-5 mr-2 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="font-medium">Mapped:</span>
                  <span className="ml-2">Ready to download</span>
                  <span className="ml-4 text-gray-500">
                    ({mappedData.length} rows × {mappedData[0]?.length || 0} columns)
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            {data.length > 0 && !loading && (
              <div className="md:col-span-1">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Source Data</h3>
                <div className="overflow-auto max-h-[500px] border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-indigo-50 sticky top-0">
                      <tr>
                        {data[0]?.map((header, index) => (
                          <th
                            key={index}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            {header || `Col ${index + 1}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {templateData.length > 0 && !loading && (
              <div className="md:col-span-1">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Template</h3>
                <div className="overflow-auto max-h-[500px] border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-green-50 sticky top-0">
                      <tr>
                        {templateData[0]?.map((header, index) => (
                          <th
                            key={index}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            {header || `Col ${index + 1}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {templateData.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {mappedData.length > 0 && !loading && (
              <div className="md:col-span-1">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Mapped Result</h3>
                <div className="overflow-auto max-h-[500px] border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200 text-xs">
                    <thead className="bg-purple-50 sticky top-0">
                      <tr>
                        {mappedData[0]?.map((header, index) => (
                          <th
                            key={index}
                            className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                          >
                            {header || `Col ${index + 1}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {mappedData.slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-3 py-2 whitespace-nowrap text-sm text-gray-900"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {data.length === 0 && templateData.length === 0 && !loading && !error && (
            <div className="text-center py-12 text-gray-400">
              <svg
                className="mx-auto h-16 w-16 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-lg">No files uploaded yet</p>
              <p className="text-sm mt-2">Upload source data and template to get started</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
