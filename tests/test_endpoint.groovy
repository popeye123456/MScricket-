import java.net.HttpURLConnection
import java.net.URL

def urlString = "http://localhost:2020/"

try {
    URL url = new URL(urlString)
    HttpURLConnection connection = (HttpURLConnection) url.openConnection()
    connection.setRequestMethod("GET")
    connection.setConnectTimeout(5000)
    connection.setReadTimeout(5000)
    
    connection.connect()
    
    int statusCode = connection.getResponseCode()
    println "Checking URL: ${urlString}"
    println "Status Code: ${statusCode}"
    
    if (statusCode == 200) {
        println "SUCCESS: Application is running and accessible."
    } else {
        println "FAILURE: Application returned status code ${statusCode}."
    }
} catch (Exception e) {
    println "ERROR: Could not connect to ${urlString}. Is the server running?"
    println "Exception: ${e.message}"
}
