
#import "RNPreferenceManager.h"

NSString *const PREFERENCE_KEY = @"RNPreferenceKey";

@implementation RNPreferenceManager

RCT_EXPORT_MODULE()


RCT_EXPORT_METHOD(set:(NSString *)data
                  suite:(NSString *)suite
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  NSUserDefaults *ud = [self getUD:suite];
  [ud setObject:data forKey:PREFERENCE_KEY];
  resolve([self getPreferences:suite]);
}

RCT_EXPORT_METHOD(clear:(NSString *)suite
                  resolve:(RCTPromiseResolveBlock)resolve
                  reject:(RCTPromiseRejectBlock)reject)
{
  NSUserDefaults *ud = [self getUD:suite];
  [ud removeObjectForKey:PREFERENCE_KEY];
  resolve([self getPreferences:suite]);
}

- (NSUserDefaults *)getUD:(NSString *)suite {
  NSUserDefaults *ud;
  if (suite.length > 0) {
    ud = [NSUserDefaults standardUserDefaults];
  } else {
    ud = [[NSUserDefaults alloc] initWithSuiteName:suite];
  }
  return ud;
}

- (NSString *)getPreferences:(NSString *)suite
{
  NSUserDefaults *ud = [self getUD:suite];
  NSString *preferences = [ud stringForKey:PREFERENCE_KEY];
  return preferences ? preferences : @"{}";
}

- (NSDictionary *)constantsToExport
{
  return @{ @"InitialPreferences": [self getPreferences:nil] };
}

@end
