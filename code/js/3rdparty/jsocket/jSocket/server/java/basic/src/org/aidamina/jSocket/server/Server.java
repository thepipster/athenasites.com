package org.aidamina.jSocket.server;
import java.io.IOException;
import java.net.*;
public class Server {

	
	int port = 3000;
	
	public Server() throws Exception {
		
		ServerSocket server = new ServerSocket(port);
		
		System.out.println("Listening");
		while(true)
		{
			Socket client = server.accept();
			System.out.println("Accepted: " +client.getRemoteSocketAddress());
			while(client.getInputStream().available()==0)
				Thread.sleep(0);
			new Handler(client);
		}
	}

	public static void main(String[] args) throws Exception {
		new Server();

	}
	
	
	

}
