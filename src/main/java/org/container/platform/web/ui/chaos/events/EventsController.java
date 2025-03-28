package org.container.platform.web.ui.chaos.events;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.container.platform.web.ui.common.ConstantsUrl;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Api(value = "EventsController v1")
@Controller
public class EventsController {

    private static final String BASE_URL = "chaos/";

    /**
     * Events 목록 페이지 이동(Go to the Events list page)
     *
     * @return the view
     */
    @ApiOperation(value = "Events 목록 페이지 이동(Go to the Experiments list page)", nickname = "getEventsList")
    @GetMapping(value = ConstantsUrl.URI_CP_CHAOS_EVENTS )
    public String getEventsList() { return BASE_URL + "events";}

}

