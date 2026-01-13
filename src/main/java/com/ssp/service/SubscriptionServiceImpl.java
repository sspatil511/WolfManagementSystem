package com.ssp.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ssp.model.PlanType;
import com.ssp.model.Subscription;
import com.ssp.model.User;
import com.ssp.repository.SubscriptionRepository;

@Service
public class SubscriptionServiceImpl implements SubscriptionService{

    @Autowired
    private UserService userService;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Override
    public Subscription createSubscription(User user) {
        
        Subscription subscription = new Subscription();
        subscription.setUser(user);
        subscription.setPlanType(PlanType.FREE);
        subscription.setSubscriptionStartDate(java.time.LocalDate.now());
        subscription.setSubscriptionEndDate(java.time.LocalDate.now().plusMonths(12));
        subscription.setValid(true);

        return subscriptionRepository.save(subscription);
    }

    @Override
    public Subscription getUsersSubscription(Long userId) throws Exception {
        
        Subscription subscription = subscriptionRepository.findByUserId(userId);

        if(!isValid(subscription)){

            subscription.setPlanType(PlanType.FREE);
            subscription.setSubscriptionEndDate(java.time.LocalDate.now().plusMonths(12));
            subscription.setSubscriptionStartDate(java.time.LocalDate.now());
        }

        return subscriptionRepository.save(subscription);
    }

    @Override
    public Subscription upgradeSubscription(Long userId, PlanType planType) {
        
        Subscription subscription = subscriptionRepository.findByUserId(userId);
        subscription.setPlanType(planType);
        subscription.setSubscriptionStartDate(java.time.LocalDate.now());

        if(planType.equals(PlanType.ANNUALLY)){

            subscription.setSubscriptionEndDate(java.time.LocalDate.now().plusMonths(12));
        }
        else{

            subscription.setSubscriptionEndDate(java.time.LocalDate.now().plusMonths(1));
        }

        return subscriptionRepository.save(subscription);
    }

    @Override
    public boolean isValid(Subscription subscription) {
        
        if(subscription.getPlanType().equals(PlanType.FREE)){

            return true;
        }

        LocalDate endDate = subscription.getSubscriptionEndDate();
        LocalDate currentDate = LocalDate.now();

        return endDate.isAfter(currentDate) || endDate.isEqual(currentDate);
    }

}
