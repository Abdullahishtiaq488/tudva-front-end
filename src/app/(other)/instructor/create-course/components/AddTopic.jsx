// // src/app/courses/create/AddTopic.jsx
// import React, { useState } from 'react';
// import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Form } from 'react-bootstrap';
// import { BsPlusCircle, BsXLg } from 'react-icons/bs';

// const AddTopic = ({ show, onHide, onDataSubmit }) => {
//   const [topicName, setTopicName] = useState('');
//   const [description, setDescription] = useState('');
//   const [videoFile, setVideoFile] = useState(null);
//   const [videoPreview, setVideoPreview] = useState(null); // Local preview URL

//   const handleVideoChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setVideoFile(file);
//       setVideoPreview(URL.createObjectURL(file)); // Create preview URL
//     } else {
//       setVideoFile(null);
//       setVideoPreview(null);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!topicName.trim() || !videoFile) {
//       alert("Please enter a topic name and select a video.");
//       return;
//     }

//         // Pass videoPreview along with other data
//     onDataSubmit({ topicName, description, videoFile, videoPreview });

//     setTopicName('');
//     setDescription('');
//     setVideoFile(null);
//     setVideoPreview(null);  // Clear the preview
//     onHide();
//   };


//   return (
//     <Modal className="fade" show={show} onHide={onHide} tabIndex={-1} aria-labelledby="addTopicLabel" aria-hidden="true">
//       <ModalHeader className="bg-dark">
//         <h5 className="modal-title text-white" id="addTopicLabel">Add topic</h5>
//         <button type="button" className="btn btn-sm btn-light mb-0 ms-auto" onClick={onHide} aria-label="Close">
//           <BsXLg />
//         </button>
//       </ModalHeader>
//       <ModalBody>
//         <Form onSubmit={handleSubmit}>
//           <Form.Group className="mb-3">
//             <Form.Label>Topic name <span className="text-danger">*</span></Form.Label>
//             <Form.Control
//               type="text"
//               placeholder="Enter topic name"
//               value={topicName}
//               onChange={(e) => setTopicName(e.target.value)}
//             />
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>Video <span className="text-danger">*</span></Form.Label>
//             <Form.Control
//               type="file"
//               accept="video/mp4"
//               onChange={handleVideoChange}
//             />
//               {/* Display video preview */}
//             {videoPreview && (
//               <video width="100%" height="auto" controls className="mt-2">
//                 <source src={videoPreview} type="video/mp4" />
//                 Your browser does not support the video tag.
//               </video>
//             )}
//           </Form.Group>
//           <Form.Group className="mb-3">
//             <Form.Label>Description</Form.Label>
//             <Form.Control
//               as="textarea"
//               rows={4}
//               placeholder="Enter course description"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </Form.Group>
//           <ModalFooter>
//             <Button variant="danger-soft" onClick={onHide}>Close</Button>
//             <Button variant="success" type="submit">Add Topic</Button> {/* Changed text back */}
//           </ModalFooter>
//         </Form>
//       </ModalBody>
//     </Modal>
//   );
// };

// export default AddTopic;

import React from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { BsPlusCircle, BsXLg } from "react-icons/bs";
import { useForm } from "react-hook-form";

const AddTopic = ({ show, onHide, onDataSubmit }) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = (data) => {
    // Ensure file is correctly captured
    const videoFile = data.videoFile[0]; // Get the actual File object

    // Pass the data (including videoFile) to Step3.jsx
    onDataSubmit({
      topicName: data.topicName,
      description: data.description,
      videoFile: videoFile, // Directly pass the File object
    });

    reset(); // Clear form after submission
    onHide(); // Close modal
  };

  return (
    <Modal className="fade" show={show} onHide={onHide} tabIndex={-1} aria-labelledby="addTopicLabel" aria-hidden="true">
      <Modal.Header className="bg-dark">
        <h5 className="modal-title text-white" id="addTopicLabel">Add Topic</h5>
        <button type="button" className="btn btn-sm btn-light mb-0 ms-auto" onClick={onHide} aria-label="Close">
          <BsXLg />
        </button>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Topic Name <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter topic name"
              {...register("topicName", { 
                required: "Topic name is required" 
              })}
            />
            {errors.topicName && <span className="text-danger">{errors.topicName.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Video <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="file"
              accept="video/mp4,video/avi,video/quicktime"
              {...register("videoFile", { 
                required: "Video file is required",
                validate: {
                  fileSize: (files) => {
                    const file = files[0];
                    const maxSize = 100 * 1024 * 1024; // 100 MB
                    return file.size <= maxSize || "File size must be less than 100 MB";
                  },
                  fileType: (files) => {
                    const file = files[0];
                    const allowedTypes = ['video/mp4', 'video/avi', 'video/quicktime'];
                    return allowedTypes.includes(file.type) || "Only MP4, AVI, and QuickTime videos are allowed";
                  }
                }
              })}
            />
            {errors.videoFile && <span className="text-danger">{errors.videoFile.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Enter course description"
              {...register("description")}
            />
          </Form.Group>

          <Modal.Footer>
            <Button variant="danger-soft" onClick={onHide}>Close</Button>
            <Button variant="success" type="submit">Add Topic</Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddTopic;