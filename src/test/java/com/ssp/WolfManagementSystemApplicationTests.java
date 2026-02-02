package com.ssp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(
    properties = {
        "spring.mail.username=test",
        "spring.mail.password=test",
        "spring.config.import="
    }
)
class WolfManagementSystemApplicationTests {

	@MockitoBean
    private JavaMailSender javaMailSender;

	@Test
	void contextLoads() {
	}

}
