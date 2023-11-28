import { Modal, Button } from 'antd';
import React, { useState } from 'react';
import { getStudent, getSession, getActivity } from '../../../../Utils/requests';
import './Roster.less';

export default function StudentModal({ linkBtn, student, getFormattedDate }) {
  const [visible, setVisible] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

    const handleViewSubmission = async (id) => {
        try {
            const studentResponse = await getStudent(id);

            const newSubmissions = await Promise.all(
                studentResponse.data.sessions.map(async (session) => {
                    const sessionResponse = await getSession(session.id);

                    const submissionsWithNames = await Promise.all(
                        sessionResponse.data.submissions.map(async (submission) => {
                            const activityResponse = await getActivity(submission.activity);
                            return {
                                ...submission,
                                name: activityResponse.data.lesson_module.name,
                            };
                        })
                    );

                    return submissionsWithNames;
                })
            );

            // Flatten the array of arrays
            const flattenedSubmissions = newSubmissions.flat();
            setSubmissions(flattenedSubmissions);
            console.log(submissions);
        } catch (error) {
            console.error('Error fetching student data:', error);
            // Handle error, e.g., display an error message to the user
        }
    };

  const handleOk = () => {
    setVisible(false);
  };

  return (
    <div>
      <button id={linkBtn ? 'link-btn' : null} onClick={showModal}>
        View
      </button>
      <Modal
        // title={student.name}
        visible={visible}
        onCancel={handleCancel}
        footer={[
          <Button key='load submission' type='secondary' onClick={() => handleViewSubmission(student.enrolled.id)}>
            Load Submissions
          </Button>,
          <Button key='ok' type='primary' onClick={handleOk}>
            OK
          </Button>,
          <div>
              {submissions && submissions.length > 0 ?
                  submissions.map((submission, index) =>
                      <button className={"pain"}>
                          <dev className={"pain1"}>
                              Submission for "{submission.name}"
                          </dev>
                          <dev className={"pain2"}>
                              {submission.updated_at}
                          </dev>
                      </button>
                  ) : <div className={"pain"}> No Submissions </div>}
          </div>
        ]}
      >
        <div id='modal-student-card-header'>
          <p id='animal'>{student.character}</p>
          <h1 id='student-card-title'>{student.name}</h1>
        </div>
        <div id='modal-card-content-container'>
          <div id='description-container'>
            <p id='label'>Last logged in:</p>
            <p id='label-info'> {getFormattedDate(student.last_logged_in)}</p>
            <br></br>
          </div>
          <div id='description-container'>
            <p id='label'>Status:</p>
            <p id='label-info'>
              {student.enrolled.enrolled ? 'Enrolled' : 'Unenrolled'}
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
