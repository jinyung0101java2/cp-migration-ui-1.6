
package org.container.platform.web.ui.catalogs.charts;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.container.platform.web.ui.common.ConstantsUrl;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;


/**
 * Charts Controller 클래스
 *
 * @author kjhoon
 * @version 1.0
 * @since 2024.04.22
 */

@Api(value = "ChartsController v1")
@Controller
public class ChartsController {
    private static final String BASE_URL = "catalogs/charts/";


/**
     * Charts 설치 페이지 이동(Go to the charts install page)
     *
     * @return the view
     */

    @ApiOperation(value ="Charts 설치 페이지 이동(Go to the charts install page)", nickname = "installCharts")
    @GetMapping(value = ConstantsUrl.URI_CP_CATALOG_REPOSITORIES +
            ConstantsUrl.URI_CP_CATALOG_CHARTS + ConstantsUrl.URI_CP_CATALOG_INSTALL)
    public String installCharts() {
        return BASE_URL + "installCharts";
    }



}

