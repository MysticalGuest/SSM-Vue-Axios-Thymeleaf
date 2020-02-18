package com.distinguish.controller;

import java.util.Arrays;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class HelloSpringMVC {
	private static final Logger LOG = Logger.getLogger(HelloSpringMVC.class);
	
    @RequestMapping(value="/hello")
    @ResponseBody
    public String test() {
    	LOG.info("hello...");
        System.out.println("hello"); 
        return "Hello Spring!"; 
    }
    
    @RequestMapping("/test")
    public String test(ModelMap map) {
    	LOG.info("testThymeleaf...");
    	map.put("thText", "设置文本内容");
        map.put("thUText", "设置文本内容");
        map.put("thValue", "设置当前元素的value值");
        map.put("thEach", Arrays.asList("列表", "遍历列表"));
        map.put("thIf", "msg is not null");
//        map.put("thObject", new UserEntity("sadfa","asfasfd","asfsaf","asdfasf","saf","asfd","sadf",1));
        System.out.println("test Thymeleaf!");
        return "test";
    }
}
