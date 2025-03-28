package org.container.platform.web.ui.chaos.experiments;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.container.platform.web.ui.common.ConstantsUrl;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Api(value = "ExperimentsController v1")
@Controller
public class ExperimentsController {

    private static final String BASE_URL = "chaos/";

    /**
     * Experiments 목록 페이지 이동(Go to the Experiments list page)
     *
     * @return the view
     */
    @ApiOperation(value = "Experiments 목록 페이지 이동(Go to the Experiments list page)", nickname = "getexperimentsList")
    @GetMapping(value = ConstantsUrl.URI_CP_CHAOS_EXPERIMENTS )
    public String getExperimentsList() { return BASE_URL + "experiments";}

    /**
     * Experiments 상세 페이지 이동(Go to the Experiments details page)
     *
     * @return the view
     */
    @ApiOperation(value = "Experiments 상세 페이지 이동(Go to the experiments details page)", nickname = "getExperimentsDetails")
    @GetMapping(value = ConstantsUrl.URI_CP_CHAOS_EXPERIMENTS + ConstantsUrl.URI_CP_DETAILS)
    public String getExperimentsDetails() { return BASE_URL + "experimentsDetail";}

    /**
     * Experiments 생성 페이지 이동(Go to the Experiments create page)
     *
     * @return the view
     */
    @ApiOperation(value = "Experiments 생성 페이지 이동(Go to the experiments create page)", nickname = "createExperiments")
    @GetMapping(value = ConstantsUrl.URI_CP_CHAOS_EXPERIMENTS + ConstantsUrl.URI_CP_CREATE)
    public String createExperiments() { return BASE_URL + "experimentsCreate";}

}

