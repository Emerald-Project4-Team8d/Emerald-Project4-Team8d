import { Modal, Button } from 'antd';
import React, { useState } from 'react';
import {
    getStudent, getSession, getActivity
} from '../../../../Utils/requests';
import './Roster.less';

export default function StudentModal({ linkBtn, student, getFormattedDate }) {
    const [visible, setVisible] = useState(false);

    // MY CODE BELOW

    const [submissions, setSubmissions] = useState([]); //Handles the submissions used in studentSubmissions component

    //MY CODE ABOVE

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleOk = () => {
        setVisible(false);
    };


    //MY CODE BELOW

    const studentSubmission = async (id) => {  //Asynchronous arrow function that handles the student submissions from strappi admin
        const studentResponse = await getStudent(id); //retrieves student information via student id
        const newSubmissions = await Promise.all(
            studentResponse.data.sessions.map(async (session) => {
                const studNames = await Promise.all(  //Fetches student session data and stores into studNames, essentially adds activity names
                    (await getSession(session.id)).data.submissions.map(async (submission) => ({
                        ...submission, //Creates a new object
                        name: (await getActivity(submission.activity)).data.lesson_module.name, //Adds property name to the submission object
                    }))
                );
                return studNames;
            })
        );
        const flattenedSubmissions = newSubmissions.flat(); //Due to the use of array of arrays, makes into one readable array
        setSubmissions(flattenedSubmissions);
        console.log(submissions); //logs submission values into console to be used in the app
    };

    //MY CODE ABOVE


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


                    //MY CODE BELOW

                    <Button key='submissions' type='secondary' onClick={( //Create a button for submissions under view in roster
                        studentSubmission(student.enrolled.id) //Handles button
                    )}
                            //Styling
                            style={{ marginBottom: '10px' }} //Below is the name for the submission button
                    > Submissions
                    </Button>,

                    <Button key='ok' type='primary' onClick={handleOk}>
                        OK
                    </Button>,
                    //New container below submission button that will display the actual submissions
                    <div>
                        {submissions && submissions.length > 0 ? ( //Checks variable exists
                            submissions.map((submission, index) => ( //Checks submission array and creates element for each submission
                                //Styling to make the submissions pop up look more pleasing and organized
                                //Under the submission button contains submissions
                                //Below is the Submission name followed but when submitted
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            Submission for "{submission.name}"
                                            {submission.updated_at}
                                        </div>
                                        <Button key='code' type='primary' //Code button used to get a pop up that shows the code submitted by student
                                                onClick={() => {
                                                    handleOk(); // Close the modal if needed
                                                }}
                                                style={{ fontSize: '12px', padding: '1px' }}>
                                            Code
                                        </Button>
                                    </div>
                                </div>
                            )) //Above is the name for the code button
                        ) : (
                            <div className="pain">No Submissions</div> //If submission array is empty display no submission
                        )}
                    </div>

                    //MY CODE ABOVE


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