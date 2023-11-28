import React, { useState, useEffect } from 'react';
import { Table, Popconfirm, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import {
	getClassroom,
	getSession,
	getActivity,
} from '../../Utils/requests';
import '../../views/Mentor/Classroom/Classroom.less'

export default function WorkspaceTable({searchParams, setSearchParams, classroomId}){
	const [submissionList, setSubmissionList] = useState([]);
	const [tab, setTab] = useState(
		searchParams.has('tab') ? searchParams.get('tab') : 'home'
	);
	const [page, setPage] = useState(
		searchParams.has('page') ? parseInt(searchParams.get('page')) : 1
	);

	useEffect(() => {
		doStuffNameLater();
		console.log(submissionList);
	}, [])

	const wsColumn = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			editable: true,
			width: '30%',
			align: 'left',
			render: (_, key) => key.name,
		},
		{
			title: 'Description',
			dataIndex: 'description',
			key: 'description',
			editable: true,
			width: '40%',
			align: 'left',
			render: (_, key) => key.description,
		},
		{
			title: 'Open Submission',
			dataIndex: 'open',
			key: 'open',
			editable: false,
			width: '20%',
			align: 'left',
			render: (_, key) => (
				<Link
					onClick={() => {
						localStorage.setItem('sandbox-activity', JSON.stringify(key.workspace))
						localStorage.setItem('my-activity', JSON.stringify(key.activity))
					}
					}
				>
					Open
				</Link>
			),
		}
	];

	const doStuffNameLater = async () => {
		try {
			const classroomResponse = await getClassroom(classroomId);
			const sessions = classroomResponse.data.sessions;
			console.log(classroomResponse.data)
			// console.log(sessions.data)
			const newSubmissionList = await Promise.all(
				sessions.map(async (session) => {
					const sessionResponse = await getSession(session.id);
					const submissions = sessionResponse.data.submissions;
					console.log(submissions)
					const activityResponses = await Promise.all(
						submissions.map(async (submission) => {
							const activityResponse = await getActivity(submission.activity);
							console.log(activityResponse.data)
							return activityResponse.data;
						})
					);

					return activityResponses.map((activity, i) => ({
						name: activity.lesson_module.name,
						description: activity.description,
						activity: activity,
						workspace: submissions[i].workspace,
					}));
				})
			);

			// Flatten the array of arrays
			const flattenedSubmissionList = newSubmissionList.flat();
			setSubmissionList(flattenedSubmissionList);

		} catch (error) {
			console.error('Error fetching data:', error);
			message.error('Error fetching data. Please try again.');
		}
	};

	return (
		<div className={"pain3"}>
			<div
				id='content-creator-table-container'
			>
				<Table
					columns={wsColumn}
					dataSource={submissionList}
					rowClassName='editable-row'
					rowKey='id'
					onChange={(Pagination) => {
						setPage(Pagination.current);
						setSearchParams({ tab, page: Pagination.current });
					}}
					pagination={{ current: page ? page : 1 }}
				></Table>
			</div>
		</div>
	)
}