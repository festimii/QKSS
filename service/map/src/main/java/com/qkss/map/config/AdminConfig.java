
package com.qkss.map.config;

import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Setter
@Configuration
@ConfigurationProperties(prefix="admin")
public class AdminConfig {
    private String password;

    /**
     * First checks QKSSMAP_ADMIN_PASSWORD in the environment;
     * if present and non-empty, returns that, otherwise the
     * value bound from application properties.
     */
    public String getPassword() {
        String env = System.getenv("QKSSMAP_ADMIN_PASSWORD");
        return (env != null && !env.isEmpty()) ? env : this.password;
    }

}
