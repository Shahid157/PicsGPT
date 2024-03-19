import UserNotifications

import OneSignalExtension

class NotificationService: UNNotificationServiceExtension {
    
    var contentHandler: ((UNNotificationContent) -> Void)?
    var receivedRequest: UNNotificationRequest!
    var bestAttemptContent: UNMutableNotificationContent?
    
    override func didReceive(_ request: UNNotificationRequest, withContentHandler contentHandler: @escaping (UNNotificationContent) -> Void) {
        self.receivedRequest = request
        self.contentHandler = contentHandler
        self.bestAttemptContent = (request.content.mutableCopy() as? UNMutableNotificationContent)
      
        
        if let bestAttemptContent = bestAttemptContent {
            /* DEBUGGING: Uncomment the 2 lines below to check this extension is executing
                          Note, this extension only runs when mutable-content is set
                          Setting an attachment or action buttons automatically adds this */
            // print("Running NotificationServiceExtension")
            // bestAttemptContent.body = "[Modified] " + bestAttemptContent.body
            
            OneSignalExtension.didReceiveNotificationExtensionRequest(self.receivedRequest, with: bestAttemptContent, withContentHandler: self.contentHandler)
          if let userDefaults = UserDefaults(suiteName: "group.com.styley.ai.onesignal") {
                 let value1 = userDefaults.string(forKey: "key1")
                 let value2 = userDefaults.string(forKey: "key2")
                 print("NSE value1 = ", value1?.description ?? "No value")
                 print("NSE value2 = ", value2?.description ?? "No value")
                 bestAttemptContent.title = value1 ?? "value1 Not Set"
                 bestAttemptContent.body = value2 ?? "value2 Not Set"
             }
             contentHandler(bestAttemptContent)
        }
    }
    
    override func serviceExtensionTimeWillExpire() {
        // Called just before the extension will be terminated by the system.
        // Use this as an opportunity to deliver your "best attempt" at modified content, otherwise the original push payload will be used.
        if let contentHandler = contentHandler, let bestAttemptContent =  bestAttemptContent {
            OneSignalExtension.serviceExtensionTimeWillExpireRequest(self.receivedRequest, with: self.bestAttemptContent)
            contentHandler(bestAttemptContent)
        }
    }  
}
