package com.h3bpm.web.vo.query;

import java.util.Date;

import com.h3bpm.web.vo.ReqListWorkflowTaskPageVo;

import OThinker.Common.DateTimeUtil;

@SuppressWarnings("deprecation")
public class QueryWorkFlowTaskList extends ReqListWorkflowTaskPageVo {

	public QueryWorkFlowTaskList(ReqListWorkflowTaskPageVo voBean) {
		this.setsEcho(voBean.getsEcho());
		this.setiDisplayStart(voBean.getiDisplayStart());
		this.setiDisplayLength(voBean.getiDisplayLength());
		this.setFlowCode(voBean.getFlowCode());
		this.setUserDisplayName(voBean.getUserDisplayName());
		this.setStartTimeStart(voBean.getStartTimeStart());

		// 页面接收的时间没有时分秒，将时分秒加大到该天的最后时刻
		if (voBean.getStartTimeEnd() != null) {
			Date startEndTime = DateTimeUtil.addHours(voBean.getStartTimeEnd(), 23);
			startEndTime = DateTimeUtil.addMinutes(startEndTime, 59);
			startEndTime = DateTimeUtil.addSeconds(startEndTime, 59);
			this.setStartTimeEnd(startEndTime);
		}
	}

}
