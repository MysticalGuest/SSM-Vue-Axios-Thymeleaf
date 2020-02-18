package com.distinguish;

import java.sql.Driver;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Enumeration;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import com.mysql.cj.jdbc.AbandonedConnectionCleanupThread;

@WebListener
public class ContextFinalizer implements ServletContextListener {

	public void contextInitialized(ServletContextEvent sce) {
	}

	public void contextDestroyed(ServletContextEvent sce) {
		Enumeration<Driver> drivers = DriverManager.getDrivers();
		Driver d = null;
		while (drivers.hasMoreElements()) {
			try {
				d = drivers.nextElement();
				DriverManager.deregisterDriver(d);
				System.out.println(String.format("ContextFinalizer:Driver %s deregistered", d));
			} catch (SQLException ex) {
				System.out.println(String.format("ContextFinalizer:Error deregistering driver %s", d) + ":" + ex);
			}
		}
		AbandonedConnectionCleanupThread.checkedShutdown();;
	}
}
