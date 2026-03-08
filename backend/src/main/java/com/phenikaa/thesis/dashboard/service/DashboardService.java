package com.phenikaa.thesis.dashboard.service;

import com.phenikaa.thesis.dashboard.dto.DashboardStatsResponse;
import com.phenikaa.thesis.user.entity.User;

public interface DashboardService {
    DashboardStatsResponse getStats(User user);
}
