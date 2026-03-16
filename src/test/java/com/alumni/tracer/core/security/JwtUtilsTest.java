package com.alumni.tracer.core.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.Duration;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.mock.env.MockEnvironment;

class JwtUtilsTest {

    private static final String TEST_PRIVATE_KEY = "MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDDlR35Fk9+vkrxBaVwmTJnzWg6kAqr0mD88Sco7YTzv+Xyv4AJP3K0x8cCwmi/Ns9J05Vywi/FAPqk0cWvqGgruEzwjPsH4QWjIRL2dBCIJXaqQlAfn7qkdyMyWMIpP6TmAU+1AUvBRyL9VTfExIjBocoFFtjaawWHjHwj8kttLAVgMvVORYwkch4+M3ysTqFc8ZkXBgBJzIDB24CEZBBGXh2GXhjJRtEUBUONP9zOvnmhrWp/ZnzkjyC+aw3ol0KwbIeWAF9N/lxOjpfoIsSqGlnQ/4juTJdpcieGyc7julMXxvgZ3sSaL28tS62T5db15tufDTpGNZoL2CLhN7YVAgMBAAECggEACbq1x9SEdjAeMe46JCdNesdyQL419wUwqPSQIk4/17ul7epOgryYHAZ3enDUXXVrC2ejSWxVNwN3nyew91jf0b5J1DTshKBSM6LAuueG2QGlbQ5+cOGfxcWyx7Li+cKo6n40il26+ILtlSpI624WxYHNtxduCIjcDg7+2ppCMUyHFlvf2yd2BA+zraYz2MLt/8qg85JGUXHQVMftj8XF8daO3DCwKaLeJm5otXPVhh7ACYVBNq00NPr2zl2QLJftorwgsWu7XmnD01IfZTrWgP4/u8TEeZo2q6O8DNXbozWJIn/+/8O39VEFpPRJiFKKPAIELPn8AeV9wc9beiO2IQKBgQD46Vn1ABVxVVIPtItw4EjW92HEy796wVn2DRFMisQxdhZykIzfJ5HWT0vfdzPeaCcS4ARuYHGdzFvmKgPBB70V/OjGOo1MURvWyWBx5w0ZjMsmNgWlM22B/KtR7fB/jgw4+dmZo86lJ4XmB8uGybpXQfumFTmn1ZFPDUs1omNcMQKBgQDJJvqlDwsKlEEze08eUXpZ/GVGzhP5Y/MkTdM4LGcoxinM2Y7fBCJGZwceSh4iclkyx16Qu3KLZmwfczl3MLPjs2OobBODrxjDO6j7TIpjcuSxVVa2JOcZDGwwrc8NNmoCFfxuuKWgmnZQs/X6KqgZJbFgC+AISX90DTZbrQ/TJQKBgQCfV7LwtmcDsFziFPAXCF1Yz/DUrKIdkV1nuCHU4BiMmU3xdTvZN1mS2hx2J7car44j9SihCDhzjfletJLGpY+UXd0d2SnPKzUpIK0O/ZxTOOBry7V9dhiqV/fMcQe+gE6uwrNcOZL2AwEiqubNmKIjbegNABVyrbNh6d61rQjyYQKBgQCppV4uZwmA2phCuvR3NXBjBCLGHHdsFYeyTpCdB5XZJYeLZNDB9dKSXcH7IbdYhegEk3CF0BFC0BbQT3VfuIt+toSOPtgWb04LGf3iMyNjzDpj9P00kNr2nSuBwpSlKAcvyysilkfZs2ullKEXY3JyAwAdaOaBFruPPLVjjAmUoQKBgQDyKyjt5bMgQ4sVnCxbHORGCwryJKZyOn5BjyZ8kg2Q6xcwhtMcyHEpVI6LROEtmR+4628vesUbAapeEY4Pj+vNXhDHcPRmOKQBIgfPlzEXFg8PQoMm3XpDKOFnQLp/dk82XhsZHxB6LwVB42Fg1ORQd/cfA92K97UV9Ybj9lvSEQ==";
    private static final String TEST_PUBLIC_KEY = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw5Ud+RZPfr5K8QWlcJkyZ81oOpAKq9Jg/PEnKO2E87/l8r+ACT9ytMfHAsJovzbPSdOVcsIvxQD6pNHFr6hoK7hM8Iz7B+EFoyES9nQQiCV2qkJQH5+6pHcjMljCKT+k5gFPtQFLwUci/VU3xMSIwaHKBRbY2msFh4x8I/JLbSwFYDL1TkWMJHIePjN8rE6hXPGZFwYAScyAwduAhGQQRl4dhl4YyUbRFAVDjT/czr55oa1qf2Z85I8gvmsN6JdCsGyHlgBfTf5cTo6X6CLEqhpZ0P+I7kyXaXInhsnO47pTF8b4Gd7Emi9vLUutk+XW9ebbnw06RjWaC9gi4Te2FQIDAQAB";

    private static final MockEnvironment TEST_ENV = new MockEnvironment();

    @Test
    void generatesAndValidatesRs256Token() {
        JwtUtils jwtUtils = new JwtUtils(TEST_PRIVATE_KEY, TEST_PUBLIC_KEY, TEST_ENV);
        UUID submissionId = UUID.randomUUID();

        String token = jwtUtils.generateSubmissionToken(submissionId, Duration.ofMinutes(30));

        assertTrue(jwtUtils.isTokenValid(token));
        assertEquals(submissionId, jwtUtils.extractSubmissionId(token));
    }

    @Test
    void rejectsMalformedToken() {
        JwtUtils jwtUtils = new JwtUtils(TEST_PRIVATE_KEY, TEST_PUBLIC_KEY, TEST_ENV);

        assertFalse(jwtUtils.isTokenValid("not-a-jwt"));
    }
}

