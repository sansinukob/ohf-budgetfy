package org.ohf.service.impl;

import org.evey.service.impl.BaseCrudServiceImpl;
import org.ohf.bean.Activity;
import org.ohf.bean.DTO.ActivityExpenseDTO;
import org.ohf.dao.ActivityDao;
import org.ohf.service.ActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Laurie on 7/2/2016.
 */
@Service("activityService")
public class ActivityServiceImpl extends BaseCrudServiceImpl<Activity> implements ActivityService {

    @Autowired
    private ActivityDao activityDao;

    @Override
    public List<ActivityExpenseDTO> findActivityExpense(Long programId) {
        return activityDao.findActivityExpense(programId, "jpql.activity.find-program-activity-expense");
    }
}
