package com.ssp.service;

import com.ssp.model.PlanType;
import com.ssp.model.Subscription;
import com.ssp.model.User;

public interface SubscriptionService {

    Subscription createSubscription(User user);

    Subscription getUsersSubscription(Long userId) throws Exception;

    Subscription upgradeSubscription(Long userId, PlanType planType);

    boolean isValid(Subscription subscription);

}
