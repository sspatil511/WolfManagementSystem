package com.ssp.response;

public class PaymentLinkResponse {

    private String paymentLinkId;
    private String paymentLinkUrl;
    private String publishableKey;

    public PaymentLinkResponse(String paymentLinkId, String paymentLinkUrl, String publishableKey) {
        this.paymentLinkId = paymentLinkId;
        this.paymentLinkUrl = paymentLinkUrl;
        this.publishableKey = publishableKey;
    }

    public String getPaymentLinkId() {
        return paymentLinkId;
    }

    public String getPaymentLinkUrl() {
        return paymentLinkUrl;
    }

    public String getPublishableKey() {
        return publishableKey;
    }
}
