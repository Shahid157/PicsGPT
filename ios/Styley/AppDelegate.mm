#import "AppDelegate.h"
#import <Crisp/Crisp.h>
#import <React/RCTBundleURLProvider.h>
#import <Firebase.h>
#import <RNBranch/RNBranch.h>

#import <AuthenticationServices/AuthenticationServices.h>
#import <SafariServices/SafariServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FBSDKApplicationDelegate.sharedInstance initializeSDK];
  [FIRApp configure];
  
  [CrispSDK configureWithWebsiteID:@"9844bc68-fb0b-4b06-9c51-946b92242082"];
  
  NSUserDefaults * shared = [[NSUserDefaults alloc] initWithSuiteName:@"group.com.styley.ai.onesignal"];
   [shared setObject:@"test 1" forKey:@"key1"];
   [shared setObject:@"test 2" forKey:@"key2"];
   [shared synchronize];
  
  // Uncomment this line to use the test key instead of the live one.
//  [RNBranch useTestInstance];
  [RNBranch initSessionWithLaunchOptions:launchOptions isReferrable:YES];
  NSURL *jsCodeLocation;
  
  [[FBSDKApplicationDelegate sharedInstance] application:application
                         didFinishLaunchingWithOptions:launchOptions];
  
  self.moduleName = @"Styley";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
    [RNBranch application:app openURL:url options:options];
    return YES;
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
   [RNBranch continueUserActivity:userActivity];
   return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
