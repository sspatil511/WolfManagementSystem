package com.ssp.controller;

import com.ssp.response.PaymentLinkResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentLink;
import com.stripe.param.PaymentLinkCreateParams;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Value("${stripe.publishable.key}")
    private String publishableKey;

    @Value("${stripe.default.price.id}")
    private String defaultPriceId;

    @PostMapping("/create-payment-link")
    public ResponseEntity<PaymentLinkResponse> createPaymentLink() {

        try {
            PaymentLinkCreateParams params =
                PaymentLinkCreateParams.builder()
                    .addLineItem(
                        PaymentLinkCreateParams.LineItem.builder()
                            .setPrice(defaultPriceId) // Stripe Price ID
                            .setQuantity(1L)
                            .build()
                    )
                    .build();

            PaymentLink paymentLink = PaymentLink.create(params);

            PaymentLinkResponse response = new PaymentLinkResponse(
                paymentLink.getId(),
                paymentLink.getUrl(),
                publishableKey
            );

            return ResponseEntity.ok(response);

        } catch (StripeException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
