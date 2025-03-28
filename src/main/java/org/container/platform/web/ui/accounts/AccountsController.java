package org.container.platform.web.ui.accounts;

import org.container.platform.web.ui.common.ConstantsUrl;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AccountsController {

    private static final String BASE_URL = "accounts/";

    @GetMapping(value = ConstantsUrl.URI_CP_ACCOUNTS_LIST)
    public String getAccountsList() {
        return BASE_URL + "accounts";
    }

    @GetMapping(value = ConstantsUrl.URI_CP_ACCOUNTS_DETAIL)
    public String getAccountsDetail() {
        return BASE_URL + "accountsDetail";
    }

    @GetMapping(value = ConstantsUrl.URI_CP_ACCOUNTS_CREATE)
    public String getAccountsCreate() {
        return BASE_URL + "accountsCreate";
    }
}
