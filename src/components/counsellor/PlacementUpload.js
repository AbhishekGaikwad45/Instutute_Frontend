import React, { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import api from "../Api/axiosInstance"; // ✅ axios instance
import { getCroppedImg } from "../counsellor/cropImage";

export default function PlacementUpload() {
  // ADD
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);

  // LIST
  const [list, setList] = useState([]);

  // CROP
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [cropPixels, setCropPixels] = useState(null);
  const [showCrop, setShowCrop] = useState(false);

  // EDIT
  const [editItem, setEditItem] = useState(null);
  const [editName, setEditName] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [updateFile, setUpdateFile] = useState(null);

  // ================= LOAD =================
  const loadData = async () => {
    try {
      const res = await api.get("/api/file/placement/all");
      setList(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // ================= IMAGE SELECT =================
  const onSelectFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCrop(true);
    };
    reader.readAsDataURL(selected);
  };

  const onCropComplete = (_, croppedAreaPixels) => {
    setCropPixels(croppedAreaPixels);
  };

  const saveCroppedImage = async () => {
    if (!cropPixels) {
      toast.error("Please adjust image");
      return;
    }

    const cropped = await getCroppedImg(imageSrc, cropPixels);

    if (isEdit) {
      setUpdateFile(cropped); // UPDATE
    } else {
      setFile(cropped); // ADD
    }

    setShowCrop(false);
  };

  // ================= ADD =================
  const submit = async () => {
    if (!name || !file) {
      toast.error("Name & image required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("studentName", name);
      formData.append("file", file);

      await api.post("/api/file/placement/upload", formData);

      toast.success("Student added");
      setName("");
      setFile(null);
      loadData();
    } catch {
      toast.error("Upload failed");
    }
  };

  // ================= DELETE =================
  const deleteItem = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await api.delete(`/api/file/delete/${id}`);
      toast.success("Deleted");
      loadData();
    } catch {
      toast.error("Delete failed");
    }
  };

  // ================= OPEN UPDATE =================
  const openUpdate = (item) => {
    setEditItem(item);
    setEditName(item.fileName);
    setUpdateFile(null);
    setIsEdit(true);
  };

  // ================= UPDATE =================
  const updateStudent = async () => {
    try {
      if (!editItem) return;

      // ONLY NAME UPDATE
      if (!updateFile) {
        await api.put(`/api/file/update-name/${editItem.id}`, {
          fileName: editName,
        });
      }
      // NAME + IMAGE UPDATE
      else {
        const formData = new FormData();
        formData.append("fileName", editName);
        formData.append("file", updateFile);

        await api.put(`/api/file/update/${editItem.id}`, formData);
      }

      toast.success("Updated");
      setIsEdit(false);
      setEditItem(null);
      setUpdateFile(null);
      loadData();
    } catch (err) {
      console.error(err);
      toast.error("Server not reachable");
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={2000} />

      {/* ADD */}
      <div className="card shadow p-4 mb-4">
        <h4>Add Placement Student</h4>

        <input
          className="form-control mb-2"
          placeholder="Student Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="file"
          className="form-control mb-2"
          accept="image/*"
          onChange={onSelectFile}
        />

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="mt-3 rounded-circle border border-primary"
            style={{ width: 120, height: 120, objectFit: "cover" }}
          />
        )}

        <button className="btn btn-success mt-3" onClick={submit}>
          Upload
        </button>
      </div>

      {/* LIST */}
      <div className="card shadow p-4">
        <h4 className="mb-3">Placed Students</h4>

        <div className="row">
          {list.map((p) => (
            <div className="col-md-3 mb-4" key={p.id}>
              <div className="card h-100 text-center">
                <img
                  src={p.url}
                  alt={p.fileName}
                  className="rounded-circle mx-auto mt-3"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                  }}
                />

                <div className="card-body">
                  <h6>{p.fileName}</h6>

                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-warning"
                      onClick={() => openUpdate(p)}
                    >
                      Update
                    </button>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteItem(p.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* UPDATE MODAL */}
      {isEdit && (
        <div className="modal show d-block bg-dark">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Update Student</h5>
                <button
                  className="btn-close"
                  onClick={() => setIsEdit(false)}
                />
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />

                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={onSelectFile}
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEdit(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={updateStudent}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CROP MODAL */}
      {showCrop && (
        <div className="modal show d-block bg-dark">
          <div className="modal-dialog modal-fullscreen">
            <div className="modal-content bg-dark text-white">
              <div className="modal-header border-0">
                <h5>Adjust Photo</h5>
                <button
                  className="btn-close btn-close-white"
                  onClick={() => setShowCrop(false)}
                />
              </div>

              <div
                className="modal-body p-0"
                style={{ height: "75vh" }}
              >
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="px-4 py-3">
                <input
                  type="range"
                  className="form-range"
                  min={1}
                  max={4}
                  step={0.1}
                  value={zoom}
                  onChange={(e) =>
                    setZoom(Number(e.target.value))
                  }
                />
              </div>

              <div className="modal-footer border-0">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowCrop(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-success"
                  onClick={saveCroppedImage}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
