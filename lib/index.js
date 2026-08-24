var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};

// src/english/builtin.ts
var builtin_exports = {};
__export(builtin_exports, {
  BUILTIN_LISTS: () => BUILTIN_LISTS,
  findBuiltinList: () => findBuiltinList
});
function findBuiltinList(id) {
  return BUILTIN_LISTS.find((list) => list.id === id);
}
var BUILTIN_LISTS;
var init_builtin = __esm({
  "src/english/builtin.ts"() {
    "use strict";
    BUILTIN_LISTS = [
      {
        id: "cefr-a1",
        label: "A1 \u57FA\u7840",
        level: "A1",
        words: [
          { text: "apple", meaning: "\u82F9\u679C", example: "I eat an apple every morning.", exampleMeaning: "\u6211\u6BCF\u5929\u65E9\u4E0A\u5403\u82F9\u679C" },
          { text: "book", meaning: "\u4E66", example: "She is reading a book.", exampleMeaning: "\u5979\u5728\u8BFB\u4E00\u672C\u4E66" },
          { text: "water", meaning: "\u6C34", example: "Can I have some water?", exampleMeaning: "\u80FD\u7ED9\u6211\u4E9B\u6C34\u5417" },
          { text: "friend", meaning: "\u670B\u53CB", example: "He is my best friend.", exampleMeaning: "\u4ED6\u662F\u6211\u6700\u597D\u7684\u670B\u53CB" },
          { text: "happy", meaning: "\u9AD8\u5174\u7684", example: "I am so happy today.", exampleMeaning: "\u6211\u4ECA\u5929\u5F88\u9AD8\u5174" },
          { text: "morning", meaning: "\u65E9\u6668", example: "Good morning, everyone.", exampleMeaning: "\u5927\u5BB6\u65E9\u4E0A\u597D" },
          { text: "house", meaning: "\u623F\u5B50", example: "They live in a big house.", exampleMeaning: "\u4ED6\u4EEC\u4F4F\u5728\u5927\u623F\u5B50\u91CC" },
          { text: "teacher", meaning: "\u8001\u5E08", example: "Our teacher is very kind.", exampleMeaning: "\u6211\u4EEC\u8001\u5E08\u5F88\u5584\u826F" },
          { text: "run", meaning: "\u8DD1", example: "I run in the park every day.", exampleMeaning: "\u6211\u6BCF\u5929\u5728\u516C\u56ED\u8DD1\u6B65" },
          { text: "blue", meaning: "\u84DD\u8272\u7684", example: "The sky is blue.", exampleMeaning: "\u5929\u7A7A\u662F\u84DD\u8272\u7684" },
          { text: "school", meaning: "\u5B66\u6821", example: "The children go to school.", exampleMeaning: "\u5B69\u5B50\u4EEC\u53BB\u4E0A\u5B66" },
          { text: "cat", meaning: "\u732B", example: "The cat is sleeping.", exampleMeaning: "\u732B\u5728\u7761\u89C9" },
          { text: "family", meaning: "\u5BB6\u5EAD", example: "My family is very big.", exampleMeaning: "\u6211\u7684\u5BB6\u5EAD\u5F88\u5927" },
          { text: "food", meaning: "\u98DF\u7269", example: "The food here is delicious.", exampleMeaning: "\u8FD9\u91CC\u7684\u98DF\u7269\u5F88\u597D\u5403" },
          { text: "help", meaning: "\u5E2E\u52A9", example: "Can you help me?", exampleMeaning: "\u4F60\u80FD\u5E2E\u5E2E\u6211\u5417" },
          { text: "music", meaning: "\u97F3\u4E50", example: "I like listening to music.", exampleMeaning: "\u6211\u559C\u6B22\u542C\u97F3\u4E50" },
          { text: "work", meaning: "\u5DE5\u4F5C", example: "He goes to work by bus.", exampleMeaning: "\u4ED6\u5750\u516C\u4EA4\u8F66\u4E0A\u73ED" },
          { text: "time", meaning: "\u65F6\u95F4", example: "What time is it now?", exampleMeaning: "\u73B0\u5728\u51E0\u70B9\u4E86" },
          { text: "car", meaning: "\u6C7D\u8F66", example: "She drives a red car.", exampleMeaning: "\u5979\u5F00\u4E00\u8F86\u7EA2\u8272\u6C7D\u8F66" },
          { text: "dog", meaning: "\u72D7", example: "The dog is very cute.", exampleMeaning: "\u8FD9\u53EA\u72D7\u5F88\u53EF\u7231" },
          { text: "brother", meaning: "\u5144\u5F1F", example: "My brother is older than me.", exampleMeaning: "\u6211\u54E5\u54E5\u6BD4\u6211\u5927" },
          { text: "door", meaning: "\u95E8", example: "Please close the door.", exampleMeaning: "\u8BF7\u5173\u4E0A\u95E8" },
          { text: "sun", meaning: "\u592A\u9633", example: "The sun is very hot today.", exampleMeaning: "\u4ECA\u5929\u592A\u9633\u5F88\u70ED" },
          { text: "pen", meaning: "\u7B14", example: "Can I borrow your pen?", exampleMeaning: "\u80FD\u501F\u4F60\u7684\u7B14\u5417" },
          { text: "eat", meaning: "\u5403", example: "We eat dinner at six.", exampleMeaning: "\u6211\u4EEC\u516D\u70B9\u5403\u665A\u996D" },
          { text: "drink", meaning: "\u559D", example: "I drink tea every morning.", exampleMeaning: "\u6211\u6BCF\u5929\u65E9\u4E0A\u559D\u8336" },
          { text: "sleep", meaning: "\u7761\u89C9", example: "I sleep eight hours a night.", exampleMeaning: "\u6211\u6BCF\u665A\u7761\u516B\u5C0F\u65F6" },
          { text: "big", meaning: "\u5927\u7684", example: "This is a big city.", exampleMeaning: "\u8FD9\u662F\u4E00\u5EA7\u5927\u57CE\u5E02" },
          { text: "small", meaning: "\u5C0F\u7684", example: "I have a small cat.", exampleMeaning: "\u6211\u6709\u4E00\u53EA\u5C0F\u732B" },
          { text: "new", meaning: "\u65B0\u7684", example: "I bought a new phone.", exampleMeaning: "\u6211\u4E70\u4E86\u4E00\u90E8\u65B0\u624B\u673A" }
        ]
      },
      {
        id: "cefr-a2",
        label: "A2 \u521D\u7EA7",
        level: "A2",
        words: [
          { text: "expensive", meaning: "\u6602\u8D35\u7684", example: "This phone is too expensive.", exampleMeaning: "\u8FD9\u90E8\u624B\u673A\u592A\u8D35\u4E86" },
          { text: "journey", meaning: "\u65C5\u7A0B", example: "We enjoyed the long journey.", exampleMeaning: "\u6211\u4EEC\u4EAB\u53D7\u4E86\u6F2B\u957F\u7684\u65C5\u7A0B" },
          { text: "decide", meaning: "\u51B3\u5B9A", example: "It is hard to decide.", exampleMeaning: "\u5F88\u96BE\u505A\u51FA\u51B3\u5B9A" },
          { text: "neighbor", meaning: "\u90BB\u5C45", example: "My neighbor is very friendly.", exampleMeaning: "\u6211\u7684\u90BB\u5C45\u5F88\u53CB\u597D" },
          { text: "believe", meaning: "\u76F8\u4FE1", example: "I believe you.", exampleMeaning: "\u6211\u76F8\u4FE1\u4F60" },
          { text: "borrow", meaning: "\u501F", example: "May I borrow your pen?", exampleMeaning: "\u80FD\u501F\u4F60\u7684\u7B14\u5417" },
          { text: "courage", meaning: "\u52C7\u6C14", example: "It takes courage to try.", exampleMeaning: "\u5C1D\u8BD5\u9700\u8981\u52C7\u6C14" },
          { text: "promise", meaning: "\u627F\u8BFA", example: "I promise to help you.", exampleMeaning: "\u6211\u7B54\u5E94\u5E2E\u52A9\u4F60" },
          { text: "weather", meaning: "\u5929\u6C14", example: "The weather is nice today.", exampleMeaning: "\u4ECA\u5929\u5929\u6C14\u5F88\u597D" },
          { text: "arrive", meaning: "\u5230\u8FBE", example: "We arrived at the airport early.", exampleMeaning: "\u6211\u4EEC\u65E9\u65E9\u5230\u4E86\u673A\u573A" },
          { text: "begin", meaning: "\u5F00\u59CB", example: "The class begins at nine.", exampleMeaning: "\u8BFE\u7A0B\u4E5D\u70B9\u5F00\u59CB" },
          { text: "bring", meaning: "\u5E26\u6765", example: "Please bring your book tomorrow.", exampleMeaning: "\u8BF7\u660E\u5929\u5E26\u4E0A\u4F60\u7684\u4E66" },
          { text: "change", meaning: "\u6539\u53D8", example: "I want to change my clothes.", exampleMeaning: "\u6211\u60F3\u6362\u8863\u670D" },
          { text: "choose", meaning: "\u9009\u62E9", example: "You can choose any color.", exampleMeaning: "\u4F60\u53EF\u4EE5\u9009\u4EFB\u4F55\u989C\u8272" },
          { text: "enjoy", meaning: "\u4EAB\u53D7", example: "We enjoy playing football.", exampleMeaning: "\u6211\u4EEC\u559C\u6B22\u8E22\u8DB3\u7403" },
          { text: "expect", meaning: "\u671F\u671B", example: "I expect to see you soon.", exampleMeaning: "\u6211\u671F\u5F85\u5F88\u5FEB\u89C1\u5230\u4F60" },
          { text: "follow", meaning: "\u8DDF\u968F", example: "Please follow me this way.", exampleMeaning: "\u8BF7\u8DDF\u6211\u8D70\u8FD9\u8FB9" },
          { text: "happen", meaning: "\u53D1\u751F", example: "What happened yesterday?", exampleMeaning: "\u6628\u5929\u53D1\u751F\u4E86\u4EC0\u4E48" },
          { text: "invite", meaning: "\u9080\u8BF7", example: "I will invite my friends.", exampleMeaning: "\u6211\u4F1A\u9080\u8BF7\u6211\u7684\u670B\u53CB" },
          { text: "laugh", meaning: "\u7B11", example: "The joke made us laugh.", exampleMeaning: "\u7B11\u8BDD\u8BA9\u6211\u4EEC\u7B11\u4E86" },
          { text: "leave", meaning: "\u79BB\u5F00", example: "We leave at eight o'clock.", exampleMeaning: "\u6211\u4EEC\u516B\u70B9\u51FA\u53D1" },
          { text: "message", meaning: "\u4FE1\u606F", example: "I left you a message.", exampleMeaning: "\u6211\u7ED9\u4F60\u7559\u4E86\u8A00" },
          { text: "notice", meaning: "\u6CE8\u610F\u5230", example: "Did you notice the sign?", exampleMeaning: "\u4F60\u6CE8\u610F\u5230\u90A3\u4E2A\u6807\u5FD7\u4E86\u5417" },
          { text: "offer", meaning: "\u63D0\u4F9B", example: "She offered me a cup of tea.", exampleMeaning: "\u5979\u7ED9\u6211\u5012\u4E86\u676F\u8336" },
          { text: "prefer", meaning: "\u66F4\u559C\u6B22", example: "I prefer coffee to tea.", exampleMeaning: "\u6BD4\u8D77\u8336\u6211\u66F4\u559C\u6B22\u5496\u5561" },
          { text: "receive", meaning: "\u6536\u5230", example: "I received your letter.", exampleMeaning: "\u6211\u6536\u5230\u4E86\u4F60\u7684\u4FE1" },
          { text: "remember", meaning: "\u8BB0\u5F97", example: "Do you remember my name?", exampleMeaning: "\u4F60\u8FD8\u8BB0\u5F97\u6211\u7684\u540D\u5B57\u5417" },
          { text: "suggest", meaning: "\u5EFA\u8BAE", example: "Can you suggest a good restaurant?", exampleMeaning: "\u80FD\u63A8\u8350\u4E00\u5BB6\u597D\u9910\u5385\u5417" },
          { text: "travel", meaning: "\u65C5\u884C", example: "I like to travel around the world.", exampleMeaning: "\u6211\u559C\u6B22\u73AF\u6E38\u4E16\u754C" },
          { text: "understand", meaning: "\u7406\u89E3", example: "I understand the problem now.", exampleMeaning: "\u6211\u73B0\u5728\u7406\u89E3\u8FD9\u4E2A\u95EE\u9898\u4E86" }
        ]
      },
      {
        id: "cefr-b1",
        label: "B1 \u4E2D\u7EA7",
        level: "B1",
        words: [
          { text: "achieve", meaning: "\u5B9E\u73B0", example: "She worked hard to achieve her goal.", exampleMeaning: "\u5979\u52AA\u529B\u5B9E\u73B0\u4E86\u76EE\u6807" },
          { text: "opportunity", meaning: "\u673A\u4F1A", example: "This is a great opportunity.", exampleMeaning: "\u8FD9\u662F\u4E00\u4E2A\u597D\u673A\u4F1A" },
          { text: "improve", meaning: "\u63D0\u9AD8", example: "I want to improve my English.", exampleMeaning: "\u6211\u60F3\u63D0\u9AD8\u82F1\u8BED\u6C34\u5E73" },
          { text: "confident", meaning: "\u81EA\u4FE1\u7684", example: "He feels confident about the exam.", exampleMeaning: "\u4ED6\u5BF9\u8003\u8BD5\u5145\u6EE1\u4FE1\u5FC3" },
          { text: "environment", meaning: "\u73AF\u5883", example: "We must protect the environment.", exampleMeaning: "\u6211\u4EEC\u5FC5\u987B\u4FDD\u62A4\u73AF\u5883" },
          { text: "appreciate", meaning: "\u611F\u6FC0", example: "I appreciate your help.", exampleMeaning: "\u611F\u8C22\u4F60\u7684\u5E2E\u52A9" },
          { text: "responsible", meaning: "\u8D1F\u8D23\u7684", example: "You are responsible for this task.", exampleMeaning: "\u4F60\u8D1F\u8D23\u8FD9\u9879\u4EFB\u52A1" },
          { text: "experience", meaning: "\u7ECF\u9A8C", example: "She has a lot of experience.", exampleMeaning: "\u5979\u7ECF\u9A8C\u4E30\u5BCC" },
          { text: "available", meaning: "\u53EF\u7528\u7684", example: "Is this seat available?", exampleMeaning: "\u8FD9\u4E2A\u5EA7\u4F4D\u6709\u4EBA\u5417" },
          { text: "compare", meaning: "\u6BD4\u8F83", example: "Let us compare the two options.", exampleMeaning: "\u8BA9\u6211\u4EEC\u6BD4\u8F83\u4E24\u4E2A\u9009\u9879" },
          { text: "concern", meaning: "\u62C5\u5FC3", example: "I am concerned about his health.", exampleMeaning: "\u6211\u62C5\u5FC3\u4ED6\u7684\u5065\u5EB7" },
          { text: "continue", meaning: "\u7EE7\u7EED", example: "Please continue with your story.", exampleMeaning: "\u8BF7\u7EE7\u7EED\u8BB2\u4F60\u7684\u6545\u4E8B" },
          { text: "develop", meaning: "\u53D1\u5C55", example: "We need to develop new skills.", exampleMeaning: "\u6211\u4EEC\u9700\u8981\u57F9\u517B\u65B0\u6280\u80FD" },
          { text: "encourage", meaning: "\u9F13\u52B1", example: "My teacher encouraged me to study.", exampleMeaning: "\u8001\u5E08\u9F13\u52B1\u6211\u5B66\u4E60" },
          { text: "essential", meaning: "\u5FC5\u8981\u7684", example: "Sleep is essential for health.", exampleMeaning: "\u7761\u7720\u5BF9\u5065\u5EB7\u81F3\u5173\u91CD\u8981" },
          { text: "gradually", meaning: "\u9010\u6E10\u5730", example: "The weather is gradually warming.", exampleMeaning: "\u5929\u6C14\u9010\u6E10\u53D8\u6696\u4E86" },
          { text: "influence", meaning: "\u5F71\u54CD", example: "Parents influence their children.", exampleMeaning: "\u7236\u6BCD\u5F71\u54CD\u7740\u5B69\u5B50" },
          { text: "maintain", meaning: "\u7EF4\u6301", example: "We must maintain our friendships.", exampleMeaning: "\u6211\u4EEC\u5FC5\u987B\u7EF4\u62A4\u53CB\u8C0A" },
          { text: "negotiate", meaning: "\u8C08\u5224", example: "They negotiated a new deal.", exampleMeaning: "\u4ED6\u4EEC\u8C08\u6210\u4E86\u65B0\u4EA4\u6613" },
          { text: "obvious", meaning: "\u660E\u663E\u7684", example: "The answer is quite obvious.", exampleMeaning: "\u7B54\u6848\u5F88\u660E\u663E" },
          { text: "participate", meaning: "\u53C2\u52A0", example: "Everyone should participate in the meeting.", exampleMeaning: "\u6BCF\u4E2A\u4EBA\u90FD\u5E94\u53C2\u52A0\u4F1A\u8BAE" },
          { text: "recommend", meaning: "\u63A8\u8350", example: "I recommend this book to you.", exampleMeaning: "\u6211\u5411\u4F60\u63A8\u8350\u8FD9\u672C\u4E66" },
          { text: "regular", meaning: "\u5B9A\u671F\u7684", example: "I go to the gym on a regular basis.", exampleMeaning: "\u6211\u7ECF\u5E38\u53BB\u5065\u8EAB\u623F" },
          { text: "significant", meaning: "\u91CD\u8981\u7684", example: "This is a significant achievement.", exampleMeaning: "\u8FD9\u662F\u91CD\u8981\u7684\u6210\u5C31" },
          { text: "strategy", meaning: "\u7B56\u7565", example: "We need a better strategy.", exampleMeaning: "\u6211\u4EEC\u9700\u8981\u66F4\u597D\u7684\u7B56\u7565" },
          { text: "succeed", meaning: "\u6210\u529F", example: "If you work hard, you will succeed.", exampleMeaning: "\u52AA\u529B\u5C31\u4F1A\u6210\u529F" },
          { text: "support", meaning: "\u652F\u6301", example: "Thank you for your support.", exampleMeaning: "\u8C22\u8C22\u4F60\u7684\u652F\u6301" },
          { text: "traditional", meaning: "\u4F20\u7EDF\u7684", example: "We celebrated a traditional holiday.", exampleMeaning: "\u6211\u4EEC\u5E86\u795D\u4E86\u4F20\u7EDF\u8282\u65E5" },
          { text: "valuable", meaning: "\u6709\u4EF7\u503C\u7684", example: "This painting is very valuable.", exampleMeaning: "\u8FD9\u5E45\u753B\u5F88\u6709\u4EF7\u503C" },
          { text: "withdraw", meaning: "\u64A4\u56DE", example: "She decided to withdraw from the race.", exampleMeaning: "\u5979\u51B3\u5B9A\u9000\u51FA\u6BD4\u8D5B" }
        ]
      },
      {
        id: "cefr-b2",
        label: "B2 \u4E2D\u9AD8\u7EA7",
        level: "B2",
        words: [
          { text: "alternative", meaning: "\u66FF\u4EE3\u65B9\u6848", example: "We need an alternative plan.", exampleMeaning: "\u6211\u4EEC\u9700\u8981\u5907\u9009\u65B9\u6848" },
          { text: "controversial", meaning: "\u6709\u4E89\u8BAE\u7684", example: "The topic is quite controversial.", exampleMeaning: "\u8FD9\u4E2A\u8BDD\u9898\u5F88\u6709\u4E89\u8BAE" },
          { text: "inevitable", meaning: "\u4E0D\u53EF\u907F\u514D\u7684", example: "Change is inevitable.", exampleMeaning: "\u53D8\u5316\u662F\u4E0D\u53EF\u907F\u514D\u7684" },
          { text: "perspective", meaning: "\u89C6\u89D2", example: "Look at it from a new perspective.", exampleMeaning: "\u6362\u4E2A\u65B0\u89D2\u5EA6\u770B" },
          { text: "thorough", meaning: "\u5F7B\u5E95\u7684", example: "We did a thorough review.", exampleMeaning: "\u6211\u4EEC\u505A\u4E86\u5F7B\u5E95\u7684\u5BA1\u67E5" },
          { text: "vulnerable", meaning: "\u8106\u5F31\u7684", example: "The system is vulnerable to attacks.", exampleMeaning: "\u7CFB\u7EDF\u5BB9\u6613\u53D7\u5230\u653B\u51FB" },
          { text: "compromise", meaning: "\u59A5\u534F", example: "We reached a reasonable compromise.", exampleMeaning: "\u6211\u4EEC\u8FBE\u6210\u4E86\u5408\u7406\u59A5\u534F" },
          { text: "acknowledge", meaning: "\u627F\u8BA4", example: "He acknowledged his mistake.", exampleMeaning: "\u4ED6\u627F\u8BA4\u4E86\u81EA\u5DF1\u7684\u9519\u8BEF" },
          { text: "ambiguous", meaning: "\u6A21\u68F1\u4E24\u53EF\u7684", example: "His answer was ambiguous.", exampleMeaning: "\u4ED6\u7684\u56DE\u7B54\u6A21\u68F1\u4E24\u53EF" },
          { text: "bias", meaning: "\u504F\u89C1", example: "We should avoid bias in research.", exampleMeaning: "\u7814\u7A76\u4E2D\u5E94\u907F\u514D\u504F\u89C1" },
          { text: "comprehensive", meaning: "\u5168\u9762\u7684", example: "We need a comprehensive analysis.", exampleMeaning: "\u6211\u4EEC\u9700\u8981\u5168\u9762\u5206\u6790" },
          { text: "consequence", meaning: "\u540E\u679C", example: "What are the consequences of this?", exampleMeaning: "\u8FD9\u4F1A\u6709\u4EC0\u4E48\u540E\u679C" },
          { text: "convince", meaning: "\u8BF4\u670D", example: "She convinced me to stay.", exampleMeaning: "\u5979\u8BF4\u670D\u4E86\u6211\u7559\u4E0B" },
          { text: "demonstrate", meaning: "\u8BC1\u660E", example: "The experiment demonstrated the theory.", exampleMeaning: "\u5B9E\u9A8C\u8BC1\u660E\u4E86\u8BE5\u7406\u8BBA" },
          { text: "elaborate", meaning: "\u8BE6\u7EC6\u7684", example: "Could you elaborate on your idea?", exampleMeaning: "\u80FD\u8BE6\u7EC6\u8BF4\u8BF4\u4F60\u7684\u60F3\u6CD5\u5417" },
          { text: "emphasize", meaning: "\u5F3A\u8C03", example: "I want to emphasize this point.", exampleMeaning: "\u6211\u60F3\u5F3A\u8C03\u8FD9\u4E00\u70B9" },
          { text: "fluctuate", meaning: "\u6CE2\u52A8", example: "Prices tend to fluctuate.", exampleMeaning: "\u4EF7\u683C\u5F80\u5F80\u4F1A\u6CE2\u52A8" },
          { text: "fundamental", meaning: "\u6839\u672C\u7684", example: "This is a fundamental problem.", exampleMeaning: "\u8FD9\u662F\u4E00\u4E2A\u6839\u672C\u95EE\u9898" },
          { text: "hesitate", meaning: "\u72B9\u8C6B", example: "Do not hesitate to ask for help.", exampleMeaning: "\u6709\u95EE\u9898\u5C3D\u7BA1\u95EE" },
          { text: "illustrate", meaning: "\u8BF4\u660E", example: "This chart illustrates the trend.", exampleMeaning: "\u8FD9\u5F20\u56FE\u8BF4\u660E\u4E86\u8D8B\u52BF" },
          { text: "justify", meaning: "\u8BC1\u660E\u5408\u7406", example: "How do you justify this decision?", exampleMeaning: "\u4F60\u600E\u4E48\u8BC1\u660E\u8FD9\u51B3\u5B9A\u5408\u7406" },
          { text: "negligible", meaning: "\u5FAE\u4E0D\u8DB3\u9053\u7684", example: "The difference is negligible.", exampleMeaning: "\u5DEE\u522B\u5FAE\u4E4E\u5176\u5FAE" },
          { text: "obstacle", meaning: "\u969C\u788D", example: "Lack of funding is a major obstacle.", exampleMeaning: "\u8D44\u91D1\u4E0D\u8DB3\u662F\u4E3B\u8981\u969C\u788D" },
          { text: "paradox", meaning: "\u6096\u8BBA", example: "This situation is a real paradox.", exampleMeaning: "\u8FD9\u771F\u662F\u4E2A\u6096\u8BBA" },
          { text: "predominant", meaning: "\u4E3B\u8981\u7684", example: "English is the predominant language.", exampleMeaning: "\u82F1\u8BED\u662F\u4E3B\u8981\u8BED\u8A00" },
          { text: "reinforce", meaning: "\u52A0\u5F3A", example: "This evidence reinforces our theory.", exampleMeaning: "\u8BC1\u636E\u52A0\u5F3A\u4E86\u6211\u4EEC\u7684\u7406\u8BBA" },
          { text: "simultaneously", meaning: "\u540C\u65F6\u5730", example: "Both events happened simultaneously.", exampleMeaning: "\u4E24\u4EF6\u4E8B\u540C\u65F6\u53D1\u751F\u4E86" },
          { text: "sufficient", meaning: "\u8DB3\u591F\u7684", example: "We have sufficient evidence.", exampleMeaning: "\u6211\u4EEC\u6709\u5145\u5206\u7684\u8BC1\u636E" },
          { text: "tentative", meaning: "\u6682\u5B9A\u7684", example: "We have a tentative agreement.", exampleMeaning: "\u6211\u4EEC\u8FBE\u6210\u4E86\u521D\u6B65\u534F\u8BAE" },
          { text: "undermine", meaning: "\u524A\u5F31", example: "It could undermine public trust.", exampleMeaning: "\u8FD9\u4F1A\u524A\u5F31\u516C\u4F17\u4FE1\u4EFB" }
        ]
      },
      {
        id: "cefr-c1",
        label: "C1 \u9AD8\u7EA7",
        level: "C1",
        words: [
          { text: "consequently", meaning: "\u56E0\u6B64", example: "Consequently, we changed the plan.", exampleMeaning: "\u56E0\u6B64\u6211\u4EEC\u6539\u53D8\u4E86\u8BA1\u5212" },
          { text: "deteriorate", meaning: "\u6076\u5316", example: "The situation began to deteriorate.", exampleMeaning: "\u60C5\u51B5\u5F00\u59CB\u6076\u5316\u4E86" },
          { text: "implication", meaning: "\u5F71\u54CD", example: "What are the implications of this?", exampleMeaning: "\u8FD9\u6709\u4EC0\u4E48\u5F71\u54CD" },
          { text: "proficient", meaning: "\u719F\u7EC3\u7684", example: "She is proficient in three languages.", exampleMeaning: "\u5979\u7CBE\u901A\u4E09\u79CD\u8BED\u8A00" },
          { text: "substantial", meaning: "\u5927\u91CF\u7684", example: "There was a substantial increase.", exampleMeaning: "\u6709\u4E86\u5927\u5E45\u589E\u957F" },
          { text: "advocate", meaning: "\u63D0\u5021", example: "She advocates for equal rights.", exampleMeaning: "\u5979\u5021\u5BFC\u5E73\u7B49\u6743\u5229" },
          { text: "alleviate", meaning: "\u7F13\u89E3", example: "The medicine helped alleviate the pain.", exampleMeaning: "\u836F\u7269\u7F13\u89E3\u4E86\u75BC\u75DB" },
          { text: "approximate", meaning: "\u5927\u7EA6\u7684", example: "The approximate cost is five hundred dollars.", exampleMeaning: "\u5927\u7EA6\u82B1\u8D39\u4E94\u767E\u7F8E\u5143" },
          { text: "coherent", meaning: "\u8FDE\u8D2F\u7684", example: "She presented a coherent argument.", exampleMeaning: "\u5979\u63D0\u51FA\u4E86\u8FDE\u8D2F\u7684\u8BBA\u70B9" },
          { text: "compile", meaning: "\u6C47\u7F16", example: "We compiled a list of references.", exampleMeaning: "\u6211\u4EEC\u6C47\u7F16\u4E86\u53C2\u8003\u6587\u732E" },
          { text: "conceivable", meaning: "\u53EF\u60F3\u8C61\u7684", example: "Every conceivable option was explored.", exampleMeaning: "\u63A2\u7D22\u4E86\u6240\u6709\u80FD\u60F3\u5230\u7684\u9009\u9879" },
          { text: "consensus", meaning: "\u5171\u8BC6", example: "We finally reached a consensus.", exampleMeaning: "\u6211\u4EEC\u7EC8\u4E8E\u8FBE\u6210\u4E86\u5171\u8BC6" },
          { text: "constraint", meaning: "\u9650\u5236", example: "Budget constraints limited our options.", exampleMeaning: "\u9884\u7B97\u9650\u5236\u4E86\u6211\u4EEC\u7684\u9009\u62E9" },
          { text: "contemplate", meaning: "\u6C89\u601D", example: "She sat and contemplated her future.", exampleMeaning: "\u5979\u5750\u7740\u601D\u8003\u672A\u6765" },
          { text: "contradict", meaning: "\u53CD\u9A73", example: "The evidence contradicts his claim.", exampleMeaning: "\u8BC1\u636E\u53CD\u9A73\u4E86\u4ED6\u7684\u8BF4\u6CD5" },
          { text: "controversy", meaning: "\u4E89\u8BAE", example: "The decision caused a lot of controversy.", exampleMeaning: "\u8FD9\u4E2A\u51B3\u5B9A\u5F15\u8D77\u5F88\u5927\u4E89\u8BAE" },
          { text: "correspond", meaning: "\u5BF9\u5E94", example: "The results correspond with our predictions.", exampleMeaning: "\u7ED3\u679C\u4E0E\u9884\u6D4B\u4E00\u81F4" },
          { text: "diminish", meaning: "\u51CF\u5C11", example: "His influence began to diminish.", exampleMeaning: "\u4ED6\u7684\u5F71\u54CD\u529B\u5F00\u59CB\u51CF\u5F31" },
          { text: "distinguish", meaning: "\u533A\u5206", example: "It is hard to distinguish the two.", exampleMeaning: "\u5F88\u96BE\u533A\u5206\u8FD9\u4E24\u8005" },
          { text: "elicit", meaning: "\u5F15\u51FA", example: "The question elicited a strong response.", exampleMeaning: "\u95EE\u9898\u5F15\u53D1\u4E86\u5F3A\u70C8\u53CD\u54CD" },
          { text: "empirical", meaning: "\u7ECF\u9A8C\u7684", example: "We need empirical evidence to support this.", exampleMeaning: "\u9700\u8981\u5B9E\u8BC1\u6765\u652F\u6301" },
          { text: "explicit", meaning: "\u660E\u786E\u7684", example: "The instructions were very explicit.", exampleMeaning: "\u8BF4\u660E\u975E\u5E38\u660E\u786E" },
          { text: "facilitate", meaning: "\u4FC3\u8FDB", example: "Technology can facilitate learning.", exampleMeaning: "\u79D1\u6280\u80FD\u4FC3\u8FDB\u5B66\u4E60" },
          { text: "fragment", meaning: "\u7247\u6BB5", example: "We only found a fragment of the text.", exampleMeaning: "\u6211\u4EEC\u53EA\u627E\u5230\u90E8\u5206\u6587\u672C" },
          { text: "hypothesis", meaning: "\u5047\u8BBE", example: "The hypothesis was tested repeatedly.", exampleMeaning: "\u5047\u8BBE\u88AB\u53CD\u590D\u9A8C\u8BC1" },
          { text: "ideology", meaning: "\u610F\u8BC6\u5F62\u6001", example: "Political ideology shapes policies.", exampleMeaning: "\u653F\u6CBB\u610F\u8BC6\u5F62\u6001\u5F71\u54CD\u653F\u7B56" },
          { text: "increment", meaning: "\u589E\u91CF", example: "Each increment brings us closer to the goal.", exampleMeaning: "\u6BCF\u6B21\u589E\u91CF\u8BA9\u6211\u4EEC\u66F4\u8FD1\u4E00\u6B65" },
          { text: "inherent", meaning: "\u56FA\u6709\u7684", example: "There are inherent risks in the plan.", exampleMeaning: "\u8BA1\u5212\u4E2D\u5B58\u5728\u56FA\u6709\u98CE\u9669" },
          { text: "meticulous", meaning: "\u4E00\u4E1D\u4E0D\u82DF\u7684", example: "She is meticulous about details.", exampleMeaning: "\u5979\u5BF9\u7EC6\u8282\u4E00\u4E1D\u4E0D\u82DF" },
          { text: "prerequisite", meaning: "\u5148\u51B3\u6761\u4EF6", example: "Experience is a prerequisite for this job.", exampleMeaning: "\u7ECF\u9A8C\u662F\u8FD9\u4EFD\u5DE5\u4F5C\u7684\u524D\u63D0" }
        ]
      },
      {
        id: "cefr-c2",
        label: "C2 \u7CBE\u901A",
        level: "C2",
        words: [
          { text: "aberration", meaning: "\u53CD\u5E38", example: "The result was a statistical aberration.", exampleMeaning: "\u7ED3\u679C\u662F\u7EDF\u8BA1\u4E0A\u7684\u5F02\u5E38" },
          { text: "circumspect", meaning: "\u8C28\u614E\u7684", example: "Be circumspect in your reply.", exampleMeaning: "\u56DE\u590D\u65F6\u8981\u8C28\u614E" },
          { text: "ephemeral", meaning: "\u77ED\u6682\u7684", example: "Fame is often ephemeral.", exampleMeaning: "\u540D\u58F0\u5F80\u5F80\u662F\u77ED\u6682\u7684" },
          { text: "quintessential", meaning: "\u5178\u578B\u7684", example: "She is the quintessential leader.", exampleMeaning: "\u5979\u662F\u5178\u578B\u7684\u9886\u5BFC\u8005" },
          { text: "ubiquitous", meaning: "\u65E0\u5904\u4E0D\u5728\u7684", example: "Smartphones are ubiquitous now.", exampleMeaning: "\u667A\u80FD\u624B\u673A\u73B0\u5728\u65E0\u5904\u4E0D\u5728" },
          { text: "acquiesce", meaning: "\u9ED8\u8BB8", example: "He reluctantly acquiesced to the demand.", exampleMeaning: "\u4ED6\u52C9\u5F3A\u9ED8\u8BB8\u4E86\u8981\u6C42" },
          { text: "amalgamate", meaning: "\u5408\u5E76", example: "The two companies amalgamated last year.", exampleMeaning: "\u4E24\u5BB6\u516C\u53F8\u53BB\u5E74\u5408\u5E76\u4E86" },
          { text: "ameliorate", meaning: "\u6539\u5584", example: "Steps were taken to ameliorate the situation.", exampleMeaning: "\u91C7\u53D6\u63AA\u65BD\u6539\u5584\u4E86\u60C5\u51B5" },
          { text: "anomaly", meaning: "\u5F02\u5E38", example: "The data showed a clear anomaly.", exampleMeaning: "\u6570\u636E\u663E\u793A\u4E86\u660E\u663E\u5F02\u5E38" },
          { text: "auspicious", meaning: "\u5409\u5229\u7684", example: "It was an auspicious start to the year.", exampleMeaning: "\u8FD9\u662F\u4E2A\u5409\u5229\u7684\u5F00\u7AEF" },
          { text: "capitulate", meaning: "\u6295\u964D", example: "The army was forced to capitulate.", exampleMeaning: "\u519B\u961F\u88AB\u8FEB\u6295\u964D\u4E86" },
          { text: "catalyst", meaning: "\u50AC\u5316\u5242", example: "The event was a catalyst for change.", exampleMeaning: "\u8BE5\u4E8B\u4EF6\u662F\u53D8\u9769\u7684\u50AC\u5316\u5242" },
          { text: "clandestine", meaning: "\u79D8\u5BC6\u7684", example: "They held clandestine meetings.", exampleMeaning: "\u4ED6\u4EEC\u4E3E\u884C\u4E86\u79D8\u5BC6\u4F1A\u8BAE" },
          { text: "conundrum", meaning: "\u96BE\u9898", example: "This ethical conundrum has no easy answer.", exampleMeaning: "\u8FD9\u4E2A\u4F26\u7406\u96BE\u9898\u65E0\u7B80\u5355\u7B54\u6848" },
          { text: "corroborate", meaning: "\u8BC1\u5B9E", example: "The witness corroborated his story.", exampleMeaning: "\u8BC1\u4EBA\u8BC1\u5B9E\u4E86\u4ED6\u7684\u8BF4\u6CD5" },
          { text: "dearth", meaning: "\u7F3A\u4E4F", example: "There is a dearth of qualified candidates.", exampleMeaning: "\u7F3A\u4E4F\u5408\u683C\u7684\u5019\u9009\u4EBA" },
          { text: "deleterious", meaning: "\u6709\u5BB3\u7684", example: "Pollution has deleterious effects on health.", exampleMeaning: "\u6C61\u67D3\u5BF9\u5065\u5EB7\u6709\u5BB3" },
          { text: "dichotomy", meaning: "\u4E8C\u5206\u6CD5", example: "There is a dichotomy between theory and practice.", exampleMeaning: "\u7406\u8BBA\u4E0E\u5B9E\u8DF5\u5B58\u5728\u4E8C\u5206" },
          { text: "discern", meaning: "\u8FA8\u522B", example: "It was hard to discern the truth.", exampleMeaning: "\u5F88\u96BE\u8FA8\u522B\u771F\u76F8" },
          { text: "discrepancy", meaning: "\u5DEE\u5F02", example: "There is a discrepancy in the reports.", exampleMeaning: "\u62A5\u544A\u4E2D\u5B58\u5728\u5DEE\u5F02" },
          { text: "elucidate", meaning: "\u9610\u660E", example: "Could you elucidate this concept?", exampleMeaning: "\u80FD\u9610\u660E\u8FD9\u4E2A\u6982\u5FF5\u5417" },
          { text: "eminent", meaning: "\u6770\u51FA\u7684", example: "She is an eminent scientist.", exampleMeaning: "\u5979\u662F\u6770\u51FA\u7684\u79D1\u5B66\u5BB6" },
          { text: "equivocal", meaning: "\u6A21\u68F1\u4E24\u53EF\u7684", example: "His response was deliberately equivocal.", exampleMeaning: "\u4ED6\u7684\u56DE\u7B54\u6545\u610F\u6A21\u68F1\u4E24\u53EF" },
          { text: "exacerbate", meaning: "\u52A0\u5267", example: "The policy only exacerbated the problem.", exampleMeaning: "\u653F\u7B56\u53EA\u662F\u52A0\u5267\u4E86\u95EE\u9898" },
          { text: "extraneous", meaning: "\u65E0\u5173\u7684", example: "Remove all extraneous details from the report.", exampleMeaning: "\u5220\u9664\u62A5\u544A\u4E2D\u6240\u6709\u65E0\u5173\u7EC6\u8282" },
          { text: "fortuitous", meaning: "\u5076\u7136\u7684", example: "A fortuitous encounter changed his life.", exampleMeaning: "\u4E00\u6B21\u5076\u7136\u76F8\u9047\u6539\u53D8\u4E86\u4EBA\u751F" },
          { text: "gregarious", meaning: "\u7231\u793E\u4EA4\u7684", example: "She has a gregarious personality.", exampleMeaning: "\u5979\u6027\u683C\u7231\u793E\u4EA4" },
          { text: "impeccable", meaning: "\u65E0\u53EF\u6311\u5254\u7684", example: "Her taste in art is impeccable.", exampleMeaning: "\u5979\u7684\u827A\u672F\u54C1\u5473\u65E0\u53EF\u6311\u5254" },
          { text: "juxtapose", meaning: "\u5E76\u5217\u5BF9\u6BD4", example: "The author juxtaposed wealth and poverty.", exampleMeaning: "\u4F5C\u8005\u5C06\u8D2B\u5BCC\u5E76\u5217\u5BF9\u6BD4" },
          { text: "magnanimous", meaning: "\u5BBD\u5B8F\u5927\u91CF\u7684", example: "She was magnanimous in victory.", exampleMeaning: "\u5979\u5728\u80DC\u5229\u65F6\u5BBD\u5B8F\u5927\u91CF" }
        ]
      }
    ];
  }
});

// node_modules/.pnpm/@deepseek-ai+cosmokit@1.8.2/node_modules/@deepseek-ai/cosmokit/lib/index.js
function isNullable(value) {
  return value === null || value === void 0;
}
function isPlainObject(data) {
  return data && typeof data === "object" && !Array.isArray(data);
}
function filterKeys(object, filter) {
  return Object.fromEntries(Object.entries(object).filter(([key, value]) => filter(key, value)));
}
function mapValues(object, transform) {
  return Object.fromEntries(Object.entries(object).map(([key, value]) => [key, transform(value, key)]));
}
function pick(source, keys, forced) {
  if (!keys) return { ...source };
  const result = {};
  for (const key of keys) if (forced || source[key] !== void 0) result[key] = source[key];
  return result;
}
function is(type, value) {
  if (arguments.length === 1) return (value2) => is(type, value2);
  return type in globalThis && value instanceof globalThis[type] || Object.prototype.toString.call(value).slice(8, -1) === type;
}
function isArrayBufferLike(value) {
  return is("ArrayBuffer", value) || is("SharedArrayBuffer", value);
}
function isArrayBufferSource(value) {
  return isArrayBufferLike(value) || ArrayBuffer.isView(value);
}
var Binary;
(function(Binary2) {
  Binary2.is = isArrayBufferLike;
  Binary2.isSource = isArrayBufferSource;
  function fromSource(source) {
    if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
    else return source;
  }
  Binary2.fromSource = fromSource;
  function toBase64(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") return Buffer.from(source).toString("base64");
    let binary = "";
    const bytes = new Uint8Array(source);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }
  Binary2.toBase64 = toBase64;
  function fromBase64(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "base64"));
    return Uint8Array.from(atob(source), (c) => c.charCodeAt(0));
  }
  Binary2.fromBase64 = fromBase64;
  function toHex(source) {
    source = fromSource(source);
    if (typeof Buffer !== "undefined") return Buffer.from(source).toString("hex");
    return Array.from(new Uint8Array(source), (byte) => byte.toString(16).padStart(2, "0")).join("");
  }
  Binary2.toHex = toHex;
  function fromHex(source) {
    if (typeof Buffer !== "undefined") return fromSource(Buffer.from(source, "hex"));
    const hex = source.length % 2 === 0 ? source : source.slice(0, source.length - 1);
    const buffer = [];
    for (let i = 0; i < hex.length; i += 2) buffer.push(parseInt(`${hex[i]}${hex[i + 1]}`, 16));
    return Uint8Array.from(buffer).buffer;
  }
  Binary2.fromHex = fromHex;
})(Binary || (Binary = {}));
var base64ToArrayBuffer = Binary.fromBase64;
var arrayBufferToBase64 = Binary.toBase64;
var hexToArrayBuffer = Binary.fromHex;
var arrayBufferToHex = Binary.toHex;
function clone(source, refs = /* @__PURE__ */ new Map()) {
  if (!source || typeof source !== "object") return source;
  if (is("Date", source)) return new Date(source.valueOf());
  if (is("RegExp", source)) return new RegExp(source.source, source.flags);
  if (isArrayBufferLike(source)) return source.slice(0);
  if (ArrayBuffer.isView(source)) return source.buffer.slice(source.byteOffset, source.byteOffset + source.byteLength);
  const cached = refs.get(source);
  if (cached) return cached;
  if (Array.isArray(source)) {
    const result2 = [];
    refs.set(source, result2);
    source.forEach((value, index) => {
      result2[index] = Reflect.apply(clone, null, [value, refs]);
    });
    return result2;
  }
  const result = Object.create(Object.getPrototypeOf(source));
  refs.set(source, result);
  for (const key of Reflect.ownKeys(source)) {
    const descriptor = { ...Reflect.getOwnPropertyDescriptor(source, key) };
    if ("value" in descriptor) descriptor.value = Reflect.apply(clone, null, [descriptor.value, refs]);
    Reflect.defineProperty(result, key, descriptor);
  }
  return result;
}
function deepEqual(a, b, strict) {
  if (a === b) return true;
  if (!strict && isNullable(a) && isNullable(b)) return true;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return false;
  if (!a || !b) return false;
  function check(test, then) {
    return test(a) ? test(b) ? then(a, b) : false : test(b) ? false : void 0;
  }
  return check(Array.isArray, (a2, b2) => a2.length === b2.length && a2.every((item, index) => deepEqual(item, b2[index]))) ?? check(is("Date"), (a2, b2) => a2.valueOf() === b2.valueOf()) ?? check(is("RegExp"), (a2, b2) => a2.source === b2.source && a2.flags === b2.flags) ?? check(isArrayBufferLike, (a2, b2) => {
    if (a2.byteLength !== b2.byteLength) return false;
    const viewA = new Uint8Array(a2);
    const viewB = new Uint8Array(b2);
    for (let i = 0; i < viewA.length; i++) if (viewA[i] !== viewB[i]) return false;
    return true;
  }) ?? Object.keys({
    ...a,
    ...b
  }).every((key) => deepEqual(a[key], b[key], strict));
}
var Time;
(function(Time2) {
  Time2.millisecond = 1;
  Time2.second = 1e3;
  Time2.minute = Time2.second * 60;
  Time2.hour = Time2.minute * 60;
  Time2.day = Time2.hour * 24;
  Time2.week = Time2.day * 7;
  let timezoneOffset = (/* @__PURE__ */ new Date()).getTimezoneOffset();
  function setTimezoneOffset(offset) {
    timezoneOffset = offset;
  }
  Time2.setTimezoneOffset = setTimezoneOffset;
  function getTimezoneOffset() {
    return timezoneOffset;
  }
  Time2.getTimezoneOffset = getTimezoneOffset;
  function getDateNumber(date2 = /* @__PURE__ */ new Date(), offset) {
    if (typeof date2 === "number") date2 = new Date(date2);
    if (offset === void 0) offset = timezoneOffset;
    return Math.floor((date2.valueOf() / Time2.minute - offset) / 1440);
  }
  Time2.getDateNumber = getDateNumber;
  function fromDateNumber(value, offset) {
    const date2 = new Date(value * Time2.day);
    if (offset === void 0) offset = timezoneOffset;
    return new Date(+date2 + offset * Time2.minute);
  }
  Time2.fromDateNumber = fromDateNumber;
  const numeric = /\d+(?:\.\d+)?/.source;
  const timeRegExp = new RegExp(`^${[
    "w(?:eek(?:s)?)?",
    "d(?:ay(?:s)?)?",
    "h(?:our(?:s)?)?",
    "m(?:in(?:ute)?(?:s)?)?",
    "s(?:ec(?:ond)?(?:s)?)?"
  ].map((unit) => `(${numeric}${unit})?`).join("")}$`);
  function parseTime(source) {
    const capture = timeRegExp.exec(source);
    if (!capture) return 0;
    return (parseFloat(capture[1]) * Time2.week || 0) + (parseFloat(capture[2]) * Time2.day || 0) + (parseFloat(capture[3]) * Time2.hour || 0) + (parseFloat(capture[4]) * Time2.minute || 0) + (parseFloat(capture[5]) * Time2.second || 0);
  }
  Time2.parseTime = parseTime;
  function parseDate(date2) {
    const parsed = parseTime(date2);
    if (parsed) date2 = Date.now() + parsed;
    else if (/^\d{1,2}(:\d{1,2}){1,2}$/.test(date2)) date2 = `${(/* @__PURE__ */ new Date()).toLocaleDateString()}-${date2}`;
    else if (/^\d{1,2}-\d{1,2}-\d{1,2}(:\d{1,2}){1,2}$/.test(date2)) date2 = `${(/* @__PURE__ */ new Date()).getFullYear()}-${date2}`;
    return date2 ? new Date(date2) : /* @__PURE__ */ new Date();
  }
  Time2.parseDate = parseDate;
  function format(ms) {
    const abs = Math.abs(ms);
    if (abs >= Time2.day - Time2.hour / 2) return Math.round(ms / Time2.day) + "d";
    else if (abs >= Time2.hour - Time2.minute / 2) return Math.round(ms / Time2.hour) + "h";
    else if (abs >= Time2.minute - Time2.second / 2) return Math.round(ms / Time2.minute) + "m";
    else if (abs >= Time2.second) return Math.round(ms / Time2.second) + "s";
    return ms + "ms";
  }
  Time2.format = format;
  function toDigits(source, length = 2) {
    return source.toString().padStart(length, "0");
  }
  Time2.toDigits = toDigits;
  function template(template2, time = /* @__PURE__ */ new Date()) {
    return template2.replace("yyyy", time.getFullYear().toString()).replace("yy", time.getFullYear().toString().slice(2)).replace("MM", toDigits(time.getMonth() + 1)).replace("dd", toDigits(time.getDate())).replace("hh", toDigits(time.getHours())).replace("mm", toDigits(time.getMinutes())).replace("ss", toDigits(time.getSeconds())).replace("SSS", toDigits(time.getMilliseconds(), 3));
  }
  Time2.template = template;
})(Time || (Time = {}));

// node_modules/.pnpm/@deepseek-ai+schemastery@3.18.1/node_modules/@deepseek-ai/schemastery/lib/index.mjs
var kSchema = Symbol.for("schemastery");
var kValidationError = Symbol.for("ValidationError");
globalThis.__schemastery_index__ ??= 0;
globalThis.__schemastery_refs__ = void 0;
var ValidationError = class extends TypeError {
  options;
  name = "ValidationError";
  constructor(message, options) {
    let prefix = "$";
    for (const segment of options.path || []) if (typeof segment === "string") prefix += "." + segment;
    else if (typeof segment === "number") prefix += "[" + segment + "]";
    else if (typeof segment === "symbol") prefix += `[Symbol(${segment.toString()})]`;
    if (prefix.startsWith(".")) prefix = prefix.slice(1);
    super((prefix === "$" ? "" : `${prefix} `) + message);
    this.options = options;
  }
  static is(error) {
    return !!error?.[kValidationError];
  }
};
Object.defineProperty(ValidationError.prototype, kValidationError, { value: true });
var Schema = function(options) {
  const schema = function(data, options2 = {}) {
    return Schema.resolve(data, schema, options2)[0];
  };
  if (options.refs) {
    const refs = mapValues(options.refs, (options2) => new Schema(options2));
    const getRef = (uid) => refs[uid];
    for (const key in refs) {
      const options2 = refs[key];
      options2.sKey = getRef(options2.sKey);
      options2.inner = getRef(options2.inner);
      options2.list = options2.list && options2.list.map(getRef);
      options2.dict = options2.dict && mapValues(options2.dict, getRef);
    }
    return refs[options.uid];
  }
  Object.assign(schema, options);
  if (typeof schema.callback === "string") try {
    schema.callback = new Function("return " + schema.callback)();
  } catch {
  }
  Object.defineProperty(schema, "uid", { value: globalThis.__schemastery_index__++ });
  Object.setPrototypeOf(schema, Schema.prototype);
  schema.meta ||= {};
  schema.toString = schema.toString.bind(schema);
  return schema;
};
Schema.prototype = Object.create(Function.prototype);
Schema.prototype[kSchema] = true;
Object.defineProperty(Schema.prototype, "~standard", { get() {
  return {
    version: 1,
    vendor: "schemastery",
    validate: (value) => {
      try {
        return { value: Schema.resolve(value, this, {})[0] };
      } catch (error) {
        if (ValidationError.is(error)) return { issues: [{
          message: error.message,
          path: error.options.path
        }] };
        throw error;
      }
    }
  };
} });
Schema.ValidationError = ValidationError;
Schema.prototype.toJSON = function toJSON() {
  if (globalThis.__schemastery_refs__) {
    globalThis.__schemastery_refs__[this.uid] ??= JSON.parse(JSON.stringify({ ...this }));
    return this.uid;
  }
  globalThis.__schemastery_refs__ = { [this.uid]: { ...this } };
  globalThis.__schemastery_refs__[this.uid] = JSON.parse(JSON.stringify({ ...this }));
  const result = {
    uid: this.uid,
    refs: globalThis.__schemastery_refs__
  };
  globalThis.__schemastery_refs__ = void 0;
  return result;
};
Schema.prototype.set = function set(key, value) {
  this.dict[key] = value;
  return this;
};
Schema.prototype.push = function push(value) {
  this.list.push(value);
  return this;
};
function mergeDesc(original, messages) {
  const result = typeof original === "string" ? { "": original } : { ...original };
  for (const locale in messages) {
    const value = messages[locale];
    if (value?.$description || value?.$desc) result[locale] = value.$description || value.$desc;
    else if (typeof value === "string") result[locale] = value;
  }
  return result;
}
function getInner(value) {
  return value?.$value ?? value?.$inner;
}
function extractKeys(data) {
  return filterKeys(data ?? {}, (key) => !key.startsWith("$"));
}
Schema.prototype.i18n = function i18n(messages) {
  const schema = Schema(this);
  const desc = mergeDesc(schema.meta.description, messages);
  if (Object.keys(desc).length) schema.meta.description = desc;
  if (schema.dict) schema.dict = mapValues(schema.dict, (inner, key) => {
    return inner.i18n(mapValues(messages, (data) => getInner(data)?.[key] ?? data?.[key]));
  });
  if (schema.list) schema.list = schema.list.map((inner, index) => {
    return inner.i18n(mapValues(messages, (data = {}) => {
      if (Array.isArray(getInner(data))) return getInner(data)[index];
      if (Array.isArray(data)) return data[index];
      return extractKeys(data);
    }));
  });
  if (schema.inner) schema.inner = schema.inner.i18n(mapValues(messages, (data) => {
    if (getInner(data)) return getInner(data);
    return extractKeys(data);
  }));
  if (schema.sKey) schema.sKey = schema.sKey.i18n(mapValues(messages, (data) => data?.$key));
  return schema;
};
Schema.prototype.extra = function extra(key, value) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
};
for (const key of [
  "required",
  "disabled",
  "collapse",
  "hidden",
  "loose"
]) Object.assign(Schema.prototype, { [key](value = true) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
Schema.prototype.deprecated = function deprecated() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "deprecated",
    type: "danger"
  });
  return schema;
};
Schema.prototype.experimental = function experimental() {
  const schema = Schema(this);
  schema.meta.badges ||= [];
  schema.meta.badges.push({
    text: "experimental",
    type: "warning"
  });
  return schema;
};
Schema.prototype.pattern = function pattern(regexp) {
  const schema = Schema(this);
  const pattern2 = pick(regexp, ["source", "flags"]);
  schema.meta = {
    ...schema.meta,
    pattern: pattern2
  };
  return schema;
};
Schema.prototype.simplify = function simplify(value) {
  if (deepEqual(value, this.meta.default, this.type === "dict")) return null;
  if (isNullable(value)) return value;
  if (this.type === "object" || this.type === "dict") {
    const result = {};
    for (const key in value) {
      const item = (this.type === "object" ? this.dict[key] : this.inner)?.simplify(value[key]);
      if (this.type === "dict" || !isNullable(item)) result[key] = item;
    }
    if (deepEqual(result, this.meta.default, this.type === "dict")) return null;
    return result;
  } else if (this.type === "array" || this.type === "tuple") {
    const result = [];
    value.forEach((value2, index) => {
      const schema = this.type === "array" ? this.inner : this.list[index];
      const item = schema ? schema.simplify(value2) : value2;
      result.push(item);
    });
    return result;
  } else if (this.type === "intersect") {
    const result = {};
    for (const item of this.list) Object.assign(result, item.simplify(value));
    return result;
  } else if (this.type === "union") for (const schema of this.list) try {
    Schema.resolve(value, schema, {});
    return schema.simplify(value);
  } catch {
  }
  return value;
};
Schema.prototype.toString = function toString(inline) {
  return formatters[this.type]?.(this, inline) ?? `Schema<${this.type}>`;
};
Schema.prototype.role = function role(role, extra2) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    role,
    extra: extra2
  };
  return schema;
};
for (const key of [
  "default",
  "link",
  "comment",
  "description",
  "max",
  "min",
  "step"
]) Object.assign(Schema.prototype, { [key](value) {
  const schema = Schema(this);
  schema.meta = {
    ...schema.meta,
    [key]: value
  };
  return schema;
} });
var resolvers = {};
Schema.extend = function extend(type, resolve3) {
  resolvers[type] = resolve3;
};
Schema.resolve = function resolve(data, schema, options = {}, strict = false) {
  if (!schema) return [data];
  if (options.ignore?.(data, schema)) return [data];
  if (isNullable(data) && schema.type !== "lazy") {
    if (schema.meta.required) throw new ValidationError(`missing required value`, options);
    let current = schema;
    let fallback = schema.meta.default;
    while (current?.type === "intersect" && isNullable(fallback)) {
      current = current.list[0];
      fallback = current?.meta.default;
    }
    if (isNullable(fallback)) return [data];
    data = clone(fallback);
  }
  const callback = resolvers[schema.type];
  if (!callback) throw new ValidationError(`unsupported type "${schema.type}"`, options);
  try {
    return callback(data, schema, options, strict);
  } catch (error) {
    if (!schema.meta.loose) throw error;
    return [schema.meta.default];
  }
};
Schema.from = function from(source) {
  if (isNullable(source)) return Schema.any();
  else if ([
    "string",
    "number",
    "boolean"
  ].includes(typeof source)) return Schema.const(source).required();
  else if (source[kSchema]) return source;
  else if (typeof source === "function") switch (source) {
    case String:
      return Schema.string().required();
    case Number:
      return Schema.number().required();
    case Boolean:
      return Schema.boolean().required();
    case Function:
      return Schema.function().required();
    default:
      return Schema.is(source).required();
  }
  else throw new TypeError(`cannot infer schema from ${source}`);
};
Schema.lazy = function lazy(builder) {
  const toJSON2 = () => {
    if (!schema.inner[kSchema]) {
      schema.inner = schema.builder();
      schema.inner.meta = {
        ...schema.meta,
        ...schema.inner.meta
      };
    }
    return schema.inner.toJSON();
  };
  const schema = new Schema({
    type: "lazy",
    builder,
    inner: { toJSON: toJSON2 }
  });
  return schema;
};
Schema.natural = function natural() {
  return Schema.number().step(1).min(0);
};
Schema.percent = function percent() {
  return Schema.number().step(0.01).min(0).max(1).role("slider");
};
Schema.date = function date() {
  return Schema.union([Schema.is(Date), Schema.transform(Schema.string().role("datetime"), (value, options) => {
    const date2 = new Date(value);
    if (isNaN(+date2)) throw new ValidationError(`invalid date "${value}"`, options);
    return date2;
  }, true)]);
};
Schema.regExp = function regExp(flag = "") {
  return Schema.union([Schema.is(RegExp), Schema.transform(Schema.string().role("regexp", { flag }), (value, options) => {
    try {
      return new RegExp(value, flag);
    } catch (e) {
      throw new ValidationError(e.message, options);
    }
  }, true)]);
};
Schema.arrayBuffer = function arrayBuffer(encoding) {
  return Schema.union([
    Schema.is(ArrayBuffer),
    Schema.is(SharedArrayBuffer),
    Schema.transform(Schema.any(), (value, options) => {
      if (Binary.isSource(value)) return Binary.fromSource(value);
      throw new ValidationError(`expected ArrayBufferSource but got ${value}`, options);
    }, true),
    ...encoding ? [Schema.transform(Schema.string(), (value, options) => {
      try {
        return encoding === "base64" ? Binary.fromBase64(value) : Binary.fromHex(value);
      } catch (e) {
        throw new ValidationError(e.message, options);
      }
    }, true)] : []
  ]);
};
Schema.extend("lazy", (data, schema, options, strict) => {
  if (!schema.inner[kSchema]) {
    schema.inner = schema.builder();
    schema.inner.meta = {
      ...schema.meta,
      ...schema.inner.meta
    };
  }
  return Schema.resolve(data, schema.inner, options, strict);
});
Schema.extend("any", (data) => {
  return [data];
});
Schema.extend("never", (data, _, options) => {
  throw new ValidationError(`expected nullable but got ${data}`, options);
});
Schema.extend("const", (data, { value }, options) => {
  if (deepEqual(data, value)) return [value];
  throw new ValidationError(`expected ${value} but got ${data}`, options);
});
function checkWithinRange(data, meta, description, options, skipMin = false) {
  const { max = Infinity, min = -Infinity } = meta;
  if (data > max) throw new ValidationError(`expected ${description} <= ${max} but got ${data}`, options);
  if (data < min && !skipMin) throw new ValidationError(`expected ${description} >= ${min} but got ${data}`, options);
}
Schema.extend("string", (data, { meta }, options) => {
  if (typeof data !== "string") throw new ValidationError(`expected string but got ${data}`, options);
  if (meta.pattern) {
    const regexp = new RegExp(meta.pattern.source, meta.pattern.flags);
    if (!regexp.test(data)) throw new ValidationError(`expect string to match regexp ${regexp}`, options);
  }
  checkWithinRange(data.length, meta, "string length", options);
  return [data];
});
function decimalShift(data, digits) {
  const str = data.toString();
  if (str.includes("e")) return data * Math.pow(10, digits);
  const index = str.indexOf(".");
  if (index === -1) return data * Math.pow(10, digits);
  const frac = str.slice(index + 1);
  const integer = str.slice(0, index);
  if (frac.length <= digits) return +(integer + frac.padEnd(digits, "0"));
  return +(integer + frac.slice(0, digits) + "." + frac.slice(digits));
}
function isMultipleOf(data, min, step) {
  step = Math.abs(step);
  if (!/^\d+\.\d+$/.test(step.toString())) return (data - min) % step === 0;
  const index = step.toString().indexOf(".");
  const digits = step.toString().slice(index + 1).length;
  return Math.abs(decimalShift(data, digits) - decimalShift(min, digits)) % decimalShift(step, digits) === 0;
}
Schema.extend("number", (data, { meta }, options) => {
  if (typeof data !== "number") throw new ValidationError(`expected number but got ${data}`, options);
  checkWithinRange(data, meta, "number", options);
  const { step } = meta;
  if (step && !isMultipleOf(data, meta.min ?? 0, step)) throw new ValidationError(`expected number multiple of ${step} but got ${data}`, options);
  return [data];
});
Schema.extend("boolean", (data, _, options) => {
  if (typeof data === "boolean") return [data];
  throw new ValidationError(`expected boolean but got ${data}`, options);
});
Schema.extend("bitset", (data, { bits, meta }, options) => {
  let value = 0, keys = [];
  if (typeof data === "number") {
    value = data;
    for (const key in bits) if (data & bits[key]) keys.push(key);
  } else if (Array.isArray(data)) {
    keys = data;
    for (const key of keys) {
      if (typeof key !== "string") throw new ValidationError(`expected string but got ${key}`, options);
      if (key in bits) value |= bits[key];
    }
  } else throw new ValidationError(`expected number or array but got ${data}`, options);
  if (value === meta.default) return [value];
  return [value, keys];
});
Schema.extend("function", (data, _, options) => {
  if (typeof data === "function") return [data];
  throw new ValidationError(`expected function but got ${data}`, options);
});
Schema.extend("is", (data, { constructor }, options) => {
  if (typeof constructor === "function") {
    if (data instanceof constructor) return [data];
    throw new ValidationError(`expected ${constructor.name} but got ${data}`, options);
  } else {
    if (isNullable(data)) throw new ValidationError(`expected ${constructor} but got ${data}`, options);
    let prototype = Object.getPrototypeOf(data);
    while (prototype) {
      if (prototype.constructor?.name === constructor) return [data];
      prototype = Object.getPrototypeOf(prototype);
    }
    throw new ValidationError(`expected ${constructor} but got ${data}`, options);
  }
});
function property(data, key, schema, options) {
  try {
    const [value, adapted] = Schema.resolve(data[key], schema, {
      ...options,
      path: [...options.path || [], key]
    });
    if (adapted !== void 0) data[key] = adapted;
    return value;
  } catch (e) {
    if (!options?.autofix) throw e;
    delete data[key];
    return schema.meta.default;
  }
}
Schema.extend("array", (data, { inner, meta }, options) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  checkWithinRange(data.length, meta, "array length", options, !isNullable(inner.meta.default));
  return [data.map((_, index) => property(data, index, inner, options))];
});
Schema.extend("dict", (data, { inner, sKey }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in data) {
    let rKey;
    try {
      rKey = Schema.resolve(key, sKey, options)[0];
    } catch (error) {
      if (strict) continue;
      throw error;
    }
    result[rKey] = property(data, key, inner, options);
    data[rKey] = data[key];
    if (key !== rKey) delete data[key];
  }
  return [result];
});
Schema.extend("tuple", (data, { list }, options, strict) => {
  if (!Array.isArray(data)) throw new ValidationError(`expected array but got ${data}`, options);
  const result = list.map((inner, index) => property(data, index, inner, options));
  if (strict) return [result];
  result.push(...data.slice(list.length));
  return [result];
});
function merge(result, data) {
  for (const key in data) {
    if (key in result) continue;
    result[key] = data[key];
  }
}
Schema.extend("object", (data, { dict }, options, strict) => {
  if (!isPlainObject(data)) throw new ValidationError(`expected object but got ${data}`, options);
  const result = {};
  for (const key in dict) {
    const value = property(data, key, dict[key], options);
    if (!isNullable(value) || key in data) result[key] = value;
  }
  if (!strict) merge(result, data);
  return [result];
});
Schema.extend("union", (data, { list, toString: toString2 }, options, strict) => {
  const messages = [];
  for (const inner of list) try {
    return Schema.resolve(data, inner, options, strict);
  } catch (error) {
    messages.push(error);
  }
  throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
});
Schema.extend("intersect", (data, { list, toString: toString2 }, options, strict) => {
  if (!list.length) return [data];
  let result;
  for (const inner of list) {
    const value = Schema.resolve(data, inner, options, true)[0];
    if (isNullable(value)) continue;
    if (isNullable(result)) result = value;
    else if (typeof result !== typeof value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
    else if (typeof value === "object") merge(result ??= {}, value);
    else if (result !== value) throw new ValidationError(`expected ${toString2()} but got ${JSON.stringify(data)}`, options);
  }
  if (!strict && isPlainObject(data)) merge(result, data);
  return [result];
});
Schema.extend("transform", (data, { inner, callback, preserve }, options) => {
  const [result, adapted = data] = Schema.resolve(data, inner, options, true);
  if (preserve) return [callback(result)];
  else return [callback(result), callback(adapted)];
});
var formatters = {};
function defineMethod(name2, keys, format) {
  formatters[name2] = format;
  Object.assign(Schema, { [name2](...args) {
    const schema = new Schema({ type: name2 });
    keys.forEach((key, index) => {
      switch (key) {
        case "sKey":
          schema.sKey = args[index] ?? Schema.string();
          break;
        case "inner":
          schema.inner = Schema.from(args[index]);
          break;
        case "list":
          schema.list = args[index].map(Schema.from);
          break;
        case "dict":
          schema.dict = mapValues(args[index], Schema.from);
          break;
        case "bits":
          schema.bits = {};
          for (const key2 in args[index]) {
            if (typeof args[index][key2] !== "number") continue;
            schema.bits[key2] = args[index][key2];
          }
          break;
        case "callback": {
          const callback = schema.callback = args[index];
          callback["toJSON"] ||= () => callback.toString();
          break;
        }
        case "constructor": {
          const constructor = schema.constructor = args[index];
          if (typeof constructor === "function") constructor["toJSON"] ||= () => constructor["name"];
          break;
        }
        default:
          schema[key] = args[index];
      }
    });
    if (name2 === "object" || name2 === "dict") schema.meta.default = {};
    else if (name2 === "array" || name2 === "tuple") schema.meta.default = [];
    else if (name2 === "bitset") schema.meta.default = 0;
    return schema;
  } });
}
defineMethod("is", ["constructor"], ({ constructor }) => {
  if (typeof constructor === "function") return constructor.name;
  else return constructor;
});
defineMethod("any", [], () => "any");
defineMethod("never", [], () => "never");
defineMethod("const", ["value"], ({ value }) => typeof value === "string" ? JSON.stringify(value) : value);
defineMethod("string", [], () => "string");
defineMethod("number", [], () => "number");
defineMethod("boolean", [], () => "boolean");
defineMethod("bitset", ["bits"], () => "bitset");
defineMethod("function", [], () => "function");
defineMethod("array", ["inner"], ({ inner }) => `${inner.toString(true)}[]`);
defineMethod("dict", ["inner", "sKey"], ({ inner, sKey }) => `{ [key: ${sKey.toString()}]: ${inner.toString()} }`);
defineMethod("tuple", ["list"], ({ list }) => `[${list.map((inner) => inner.toString()).join(", ")}]`);
defineMethod("object", ["dict"], ({ dict }) => {
  if (Object.keys(dict).length === 0) return "{}";
  return `{ ${Object.entries(dict).map(([key, inner]) => {
    return `${key}${inner.meta.required ? "" : "?"}: ${inner.toString()}`;
  }).join(", ")} }`;
});
defineMethod("union", ["list"], ({ list }, inline) => {
  const result = list.map(({ toString: format }) => format()).join(" | ");
  return inline ? `(${result})` : result;
});
defineMethod("intersect", ["list"], ({ list }) => {
  return `${list.map((inner) => inner.toString(true)).join(" & ")}`;
});
defineMethod("transform", [
  "inner",
  "callback",
  "preserve"
], ({ inner }, isInner) => inner.toString(isInner));

// src/index.ts
import { mkdir as mkdir3, writeFile as writeFile3 } from "node:fs/promises";
import { homedir } from "node:os";
import { join as join5, resolve as resolve2 } from "node:path";

// src/routes.ts
import { readFile, stat, writeFile, unlink, mkdir, rename } from "node:fs/promises";
import { extname, join as join2, isAbsolute } from "node:path";

// src/default-avatar.ts
var DEFAULT_AVATAR_BASE64 = "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";
var DEFAULT_AVATAR_CONTENT_TYPE = "image/png";
var DEFAULT_AVATAR_BYTES = Buffer.from(DEFAULT_AVATAR_BASE64, "base64");

// src/open-app.ts
import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
var EXTRA_OPEN_KINDS = [
  "android-studio",
  "xcode",
  "wechat-devtools",
  "intellij-idea",
  "deveco-studio",
  "webstorm",
  "pycharm",
  "goland"
];
function isExtraOpenKind(value) {
  return EXTRA_OPEN_KINDS.includes(value);
}
function extraOpenLabel(kind) {
  switch (kind) {
    case "android-studio":
      return "Android Studio";
    case "xcode":
      return "Xcode";
    case "wechat-devtools":
      return "\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177";
    case "intellij-idea":
      return "IntelliJ IDEA";
    case "deveco-studio":
      return "DevEco Studio";
    case "webstorm":
      return "WebStorm";
    case "pycharm":
      return "PyCharm";
    case "goland":
      return "GoLand";
  }
}
function extraOpenCommand(platform, kind, path) {
  switch (kind) {
    case "android-studio": {
      if (platform === "darwin") return [{ command: "open", args: ["-a", "Android Studio", path] }];
      if (platform === "win32") return [{ command: "studio64.exe", args: [path] }];
      if (platform === "linux") return [{ command: "studio.sh", args: [path] }];
      return [];
    }
    case "xcode":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "Xcode", path] }];
      return [];
    case "wechat-devtools": {
      const projectArgs = ["open", "--project", path];
      if (platform === "darwin") {
        return [
          { command: "/Applications/wechatwebdevtools.app/Contents/MacOS/cli", args: projectArgs },
          { command: "/Applications/\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177.app/Contents/MacOS/cli", args: projectArgs },
          // 兼容旧版 CLI：-o <path>（仅兜底）
          { command: "/Applications/wechatwebdevtools.app/Contents/MacOS/cli", args: ["-o", path] }
        ];
      }
      if (platform === "win32") {
        return [
          { command: "C:\\Program Files (x86)\\Tencent\\\u5FAE\u4FE1web\u5F00\u53D1\u8005\u5DE5\u5177\\cli.bat", args: projectArgs },
          { command: `${process.env.LOCALAPPDATA ?? "C:\\Users\\%USERNAME%"}\\\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177\\cli.bat`, args: projectArgs },
          { command: "cli", args: projectArgs }
        ];
      }
      return [];
    }
    case "intellij-idea":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "IntelliJ IDEA", path] }];
      return [{ command: "idea", args: [path] }];
    case "webstorm":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "WebStorm", path] }];
      return [{ command: "webstorm", args: [path] }];
    case "pycharm":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "PyCharm", path] }];
      return [{ command: "pycharm", args: [path] }];
    case "goland":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "GoLand", path] }];
      return [{ command: "goland", args: [path] }];
    case "deveco-studio":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "DevEco Studio", path] }];
      return [{ command: "devecostudio", args: [path] }];
  }
}
function filterExistingCandidates(candidates) {
  return candidates.filter((candidate) => {
    const isAbsolutePath = /^[\/\\]/.test(candidate.command) || /^[A-Za-z]:\\/.test(candidate.command);
    if (!isAbsolutePath) return true;
    return existsSync(candidate.command);
  });
}
function isOpenKind(value) {
  return value === "finder" || value === "terminal" || value === "vscode";
}
function isTerminalPreference(value) {
  return value === "terminal-default" || value === "terminal-iterm" || value === "terminal-wterm" || value === "terminal-gnome" || value === "terminal-konsole" || value === "terminal-xfce";
}
function isEditorPreference(value) {
  return value === "editor-default" || value === "editor-insiders" || value === "editor-cursor" || value === "editor-codebuddy" || value === "editor-codebuddycn" || value === "editor-catpaw" || value === "editor-catpawai" || value === "editor-trae" || value === "editor-traecn" || value === "editor-qoder" || value === "editor-qodercn";
}
function shSingleQuote(value) {
  return `'${value.replace(/'/gu, `'\\''`)}'`;
}
function darwinCandidates(kind, path) {
  switch (kind) {
    case "finder":
      return [{ command: "open", args: [path] }];
    case "terminal":
      return [
        { command: "open", args: ["-a", "Terminal", path] },
        { command: "open", args: ["-a", "iTerm", path] }
      ];
    case "vscode":
      return [
        { command: "code", args: [path] },
        { command: "code-insiders", args: [path] }
      ];
  }
}
function win32Candidates(kind, path) {
  switch (kind) {
    case "finder":
      return [{ command: "explorer", args: [path] }];
    case "terminal":
      return [
        { command: "wt", args: ["-d", path] },
        { command: "powershell.exe", args: ["-NoExit", "-Command", `Set-Location -LiteralPath '${path.replace(/'/gu, "''")}'`] }
      ];
    case "vscode":
      return [
        { command: "code", args: [path] },
        { command: "code-insiders", args: [path] }
      ];
  }
}
function linuxCandidates(kind, path) {
  switch (kind) {
    case "finder":
      return [{ command: "xdg-open", args: [path] }];
    case "terminal":
      return [
        { command: "x-terminal-emulator", args: ["-e", "sh", "-c", `cd ${shSingleQuote(path)} && exec sh`] },
        { command: "gnome-terminal", args: [`--working-directory=${path}`] },
        { command: "konsole", args: ["--workdir", path] },
        { command: "xfce4-terminal", args: ["--working-directory", path] }
      ];
    case "vscode":
      return [
        { command: "code", args: [path] },
        { command: "code-insiders", args: [path] }
      ];
  }
}
function defaultCandidates(platform, kind, path) {
  switch (platform) {
    case "darwin":
      return darwinCandidates(kind, path);
    case "win32":
      return win32Candidates(kind, path);
    case "linux":
      return linuxCandidates(kind, path);
    default:
      return [];
  }
}
function resolveTerminalPreference(platform, id, path) {
  switch (id) {
    // default：交给默认候选链
    case "terminal-default":
      return void 0;
    case "terminal-iterm":
      if (platform === "darwin") return [{ command: "open", args: ["-a", "iTerm", path] }];
      return void 0;
    case "terminal-wterm":
      if (platform === "win32") return [{ command: "wt", args: ["-d", path] }];
      return void 0;
    case "terminal-gnome":
      if (platform === "linux") return [{ command: "gnome-terminal", args: [`--working-directory=${path}`] }];
      return void 0;
    case "terminal-konsole":
      if (platform === "linux") return [{ command: "konsole", args: ["--workdir", path] }];
      return void 0;
    case "terminal-xfce":
      if (platform === "linux") return [{ command: "xfce4-terminal", args: ["--working-directory", path] }];
      return void 0;
    default:
      return void 0;
  }
}
function resolveEditorPreference(_platform, id, path) {
  switch (id) {
    case "editor-default":
      return void 0;
    case "editor-insiders":
      return [{ command: "code-insiders", args: [path] }];
    case "editor-cursor":
      return [{ command: "cursor", args: [path] }];
    case "editor-codebuddy":
      return [{ command: "buddy", args: [path] }];
    case "editor-codebuddycn":
      return [{ command: "buddycn", args: [path] }];
    case "editor-catpaw":
      return [{ command: "catpaw", args: [path] }];
    case "editor-catpawai":
      return [{ command: "catpawai", args: [path] }];
    case "editor-trae":
      return [{ command: "trae", args: [path] }];
    case "editor-traecn":
      return [{ command: "trae-cn", args: [path] }];
    case "editor-qoder":
      return [{ command: "qoder", args: [path] }];
    case "editor-qodercn":
      return [{ command: "qoder-cn", args: [path] }];
    default:
      return void 0;
  }
}
function openCommandCandidates(platform, kind, path, preference) {
  if (preference !== void 0) {
    if (kind === "terminal") {
      const id = preference.terminal;
      if (id !== void 0 && isTerminalPreference(id)) {
        const resolved = resolveTerminalPreference(platform, id, path);
        if (resolved !== void 0) return resolved;
      }
    } else if (kind === "vscode") {
      const id = preference.editor;
      if (id !== void 0 && isEditorPreference(id)) {
        const resolved = resolveEditorPreference(platform, id, path);
        if (resolved !== void 0) return resolved;
      }
    }
  }
  return defaultCandidates(platform, kind, path);
}
var defaultSpawn = (command, args, options) => spawn(command, [...args], options);
async function openPathIn(kind, path, options = {}) {
  const platform = options.platform ?? process.platform;
  const spawnFn = options.spawnFn ?? defaultSpawn;
  const prefId = kind === "terminal" ? options.preference?.terminal : kind === "vscode" ? options.preference?.editor : void 0;
  const candidates = openCommandCandidates(platform, kind, path, options.preference);
  const prefValid = prefId !== void 0 && (kind === "terminal" ? isTerminalPreference(prefId) : isEditorPreference(prefId));
  const usedPreference = prefValid && candidates.length === 1 && prefId !== "terminal-default" && prefId !== "editor-default";
  if (candidates.length === 0) {
    return { ok: false, error: `unsupported platform "${platform}"` };
  }
  let lastError = "no candidate command found";
  for (const candidate of candidates) {
    try {
      const opened = await new Promise((resolve3) => {
        const child = spawnFn(candidate.command, candidate.args, { detached: true, stdio: "ignore" });
        child.on("error", (error) => {
          resolve3({ ok: false, error: error.message });
        });
        child.on("spawn", () => {
          child.unref();
          resolve3({ ok: true });
        });
      });
      if (opened.ok) return opened;
      lastError = opened.error ?? lastError;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  if (usedPreference) {
    return { ok: false, error: `preferred "${prefId}" not available: ${lastError}` };
  }
  return { ok: false, error: lastError };
}
async function openExtraPathIn(kind, path, options = {}) {
  const platform = options.platform ?? process.platform;
  const spawnFn = options.spawnFn ?? defaultSpawn;
  if (kind === "wechat-devtools") {
    const configJson = join(path, "project.config.json");
    if (!existsSync(configJson)) {
      return {
        ok: false,
        error: `\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177\u53EA\u80FD\u7528\u5C0F\u7A0B\u5E8F\u9879\u76EE\u6839\u76EE\u5F55\u6253\u5F00\uFF1A${path} \u4E0B\u672A\u627E\u5230 project.config.json\uFF08\u8BF7\u9009\u62E9\u542B project.config.json \u7684\u5C0F\u7A0B\u5E8F\u9879\u76EE\u76EE\u5F55\uFF09`
      };
    }
  }
  const candidates = filterExistingCandidates(extraOpenCommand(platform, kind, path));
  if (candidates.length === 0) {
    return { ok: false, error: `"${extraOpenLabel(kind)}" is not available on platform "${platform}"` };
  }
  let lastError = "no candidate command found";
  for (const candidate of candidates) {
    try {
      const opened = await new Promise((resolve3) => {
        const child = spawnFn(candidate.command, candidate.args, { detached: true, stdio: "ignore" });
        child.on("error", (error) => {
          resolve3({ ok: false, error: error.message });
        });
        child.on("spawn", () => {
          child.unref();
          resolve3({ ok: true });
        });
      });
      if (opened.ok) return opened;
      lastError = opened.error ?? lastError;
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
    }
  }
  if (kind === "wechat-devtools") {
    return {
      ok: false,
      error: `\u672A\u80FD\u5524\u8D77\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177\uFF1A${lastError}\uFF08\u82E5\u547D\u4EE4\u5DF2\u6267\u884C\u4F46\u5DE5\u5177\u672A\u6253\u5F00\uFF0C\u8BF7\u5148\u5728\u5FAE\u4FE1\u5F00\u53D1\u8005\u5DE5\u5177\u300C\u8BBE\u7F6E \u2192 \u5B89\u5168\u8BBE\u7F6E \u2192 \u5F00\u542F\u670D\u52A1\u7AEF\u53E3\u300D\uFF09`
    };
  }
  return { ok: false, error: `"${extraOpenLabel(kind)}" failed: ${lastError}` };
}

// src/routes.ts
var CONTENT_TYPES = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml"
};
function avatarContentType(path) {
  return CONTENT_TYPES[extname(path).toLowerCase()] ?? "image/png";
}
var MAX_AVATAR_BYTES = 10 * 1024 * 1024;
var OK = (value) => JSON.stringify({ ok: true, ...value });
function readBody(req, maxBytes) {
  return new Promise((resolve3, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        reject(new Error(`request body exceeds ${maxBytes} bytes`));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => {
      resolve3(Buffer.concat(chunks));
    });
    req.on("error", reject);
  });
}
function sniffImageType(buffer) {
  if (buffer.length >= 8 && buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71) {
    return ".png";
  }
  if (buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255) {
    return ".jpg";
  }
  if (buffer.length >= 4 && buffer[0] === 71 && buffer[1] === 73 && buffer[2] === 70 && buffer[3] === 56) {
    return ".gif";
  }
  if (buffer.length >= 12 && buffer.toString("latin1", 0, 4) === "RIFF" && buffer.toString("latin1", 8, 12) === "WEBP") {
    return ".webp";
  }
  return void 0;
}
async function atomicWriteFile(target, text) {
  const tmp = `${target}.tmp`;
  await writeFile(tmp, text, "utf8");
  await rename(tmp, target);
}
function createWorkbenchRoutes(runtime) {
  const avatarHandler = async (_req, res) => {
    const avatarPath = runtime.resolve().banner.avatarPath;
    if (avatarPath.length > 0) {
      try {
        const info = await stat(avatarPath);
        if (info.isFile()) {
          const body = await readFile(avatarPath);
          res.writeHead(200, {
            "Content-Type": avatarContentType(avatarPath),
            "Content-Length": body.length,
            "Cache-Control": "no-cache"
          });
          res.end(body);
          return;
        }
      } catch {
      }
    }
    res.writeHead(200, {
      "Content-Type": DEFAULT_AVATAR_CONTENT_TYPE,
      "Content-Length": DEFAULT_AVATAR_BYTES.length,
      "Cache-Control": "no-cache"
    });
    res.end(DEFAULT_AVATAR_BYTES);
  };
  return [
    {
      kind: "exact",
      path: "/bga-dsh-workbench/avatar",
      handler: async (req, res) => {
        if (req.method === "POST") {
          try {
            const body = await readBody(req, MAX_AVATAR_BYTES);
            if (sniffImageType(body) === void 0) {
              throw new Error("unsupported image type (png, jpg, gif, webp supported)");
            }
            const avatarPath = await runtime.saveAvatar(body);
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(OK({ avatarPath }));
          } catch (error) {
            res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ ok: false, error: error.message }));
          }
          return;
        }
        await avatarHandler(req, res);
      }
    },
    {
      kind: "exact",
      path: "/bga-dsh-workbench/config",
      handler: (_req, res) => {
        res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
        res.end(JSON.stringify(runtime.resolve()));
      }
    },
    {
      kind: "exact",
      path: "/bga-dsh-workbench/settings",
      handler: async (req, res) => {
        try {
          const body = await readBody(req, 64 * 1024);
          const parsed = JSON.parse(body.toString("utf8"));
          if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
            throw new Error("settings patch must be an object");
          }
          const banner = parsed.banner;
          const confetti = parsed.confetti;
          const open = parsed.open;
          const openExtra = parsed.openExtra;
          const patch = {};
          if (banner !== void 0) {
            if (typeof banner !== "object" || banner === null || Array.isArray(banner)) {
              throw new Error("banner must be an object");
            }
            const fields = banner;
            const item = {};
            if (fields.avatarPath !== void 0) {
              if (typeof fields.avatarPath !== "string") throw new Error("banner.avatarPath must be a string");
              item.avatarPath = fields.avatarPath;
            }
            if (fields.text !== void 0) {
              if (typeof fields.text !== "string") throw new Error("banner.text must be a string");
              item.text = fields.text;
            }
            if (fields.show !== void 0) {
              if (typeof fields.show !== "boolean") throw new Error("banner.show must be a boolean");
              item.show = fields.show;
            }
            patch.banner = item;
          }
          if (confetti !== void 0) {
            if (typeof confetti !== "object" || confetti === null || Array.isArray(confetti)) {
              throw new Error("confetti must be an object");
            }
            const fields = confetti;
            const item = {};
            if (fields.sound !== void 0) {
              if (typeof fields.sound !== "boolean") throw new Error("confetti.sound must be a boolean");
              item.sound = fields.sound;
            }
            if (fields.theme !== void 0) {
              const allowed = ["default", "gold", "ocean", "sakura", "neon"];
              if (typeof fields.theme !== "string" || !allowed.includes(fields.theme)) {
                throw new Error("confetti.theme must be one of default|gold|ocean|sakura|neon");
              }
              item.theme = fields.theme;
            }
            if (fields.intensity !== void 0) {
              const allowed = ["small", "medium", "large", "epic"];
              if (typeof fields.intensity !== "string" || !allowed.includes(fields.intensity)) {
                throw new Error("confetti.intensity must be one of small|medium|large|epic");
              }
              item.intensity = fields.intensity;
            }
            if (fields.trigger !== void 0) {
              const allowed = ["success", "every", "task"];
              if (typeof fields.trigger !== "string" || !allowed.includes(fields.trigger)) {
                throw new Error("confetti.trigger must be one of success|every|task");
              }
              item.trigger = fields.trigger;
            }
            patch.confetti = item;
          }
          if (open !== void 0) {
            if (typeof open !== "object" || open === null || Array.isArray(open)) {
              throw new Error("open must be an object");
            }
            const fields = open;
            const item = {};
            if (fields.terminal !== void 0) {
              if (typeof fields.terminal !== "string") throw new Error("open.terminal must be a string");
              if (!isTerminalPreference(fields.terminal)) {
                throw new Error(`open.terminal is not a known terminal preference: ${fields.terminal}`);
              }
              item.terminal = fields.terminal;
            }
            if (fields.editor !== void 0) {
              if (typeof fields.editor !== "string") throw new Error("open.editor must be a string");
              if (!isEditorPreference(fields.editor)) {
                throw new Error(`open.editor is not a known editor preference: ${fields.editor}`);
              }
              item.editor = fields.editor;
            }
            patch.open = item;
          }
          if (openExtra !== void 0) {
            if (typeof openExtra !== "object" || openExtra === null || Array.isArray(openExtra)) {
              throw new Error("openExtra must be an object");
            }
            const fields = openExtra;
            const keys = ["androidStudio", "xcode", "wechatDevtools", "intellijIdea", "devecoStudio", "webstorm", "pycharm", "goland"];
            const item = {};
            for (const key of keys) {
              if (fields[key] !== void 0) {
                if (typeof fields[key] !== "boolean") {
                  throw new Error(`openExtra.${key} must be a boolean`);
                }
                item[key] = Boolean(fields[key]);
              }
            }
            patch.openExtra = item;
          }
          const english = parsed.english;
          if (english !== void 0) {
            if (typeof english !== "object" || english === null || Array.isArray(english)) {
              throw new Error("english must be an object");
            }
            const efields = english;
            const eitem = {};
            if (efields.enabled !== void 0) {
              if (typeof efields.enabled !== "boolean") throw new Error("english.enabled must be a boolean");
              eitem.enabled = efields.enabled;
            }
            patch.english = eitem;
          }
          await runtime.updateSettings(patch);
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(OK({}));
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: error.message }));
        }
      }
    },
    /**
     * 任务看板持久化端点。
     * - GET    读 tasks.json（文件不存在时返回 '[]'）；
     * - POST   原子写回整个任务列表（先校验 JSON 合法再落盘）；
     * - DELETE 清空任务文件。
     */
    {
      kind: "exact",
      path: "/bga-dsh-workbench/tasks",
      handler: async (req, res) => {
        const tasksFile = join2(runtime.storageDir, "tasks.json");
        try {
          if (req.method === "DELETE") {
            await unlink(tasksFile).catch(() => {
            });
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(OK({}));
            return;
          }
          if (req.method === "POST") {
            const body = await readBody(req, 2 * 1024 * 1024);
            const text = body.toString("utf8");
            JSON.parse(text);
            await mkdir(runtime.storageDir, { recursive: true });
            await atomicWriteFile(tasksFile, text);
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(OK({}));
            return;
          }
          const data = await readFile(tasksFile, "utf8").catch(() => "[]");
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(data);
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: error.message }));
        }
      }
    },
    /**
     * 工作台元数据持久化端点（日报「当日已完成」打卡等小块状态）。
     * - GET    读 workbench-meta.json（文件不存在时返回 '{}'）；
     * - POST   原子写回整个元数据对象（先校验 JSON 合法再落盘）。
     */
    {
      kind: "exact",
      path: "/bga-dsh-workbench/workbench-meta",
      handler: async (req, res) => {
        const metaFile = join2(runtime.storageDir, "workbench-meta.json");
        try {
          if (req.method === "POST") {
            const body = await readBody(req, 256 * 1024);
            const text = body.toString("utf8");
            JSON.parse(text);
            await mkdir(runtime.storageDir, { recursive: true });
            await atomicWriteFile(metaFile, text);
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(OK({}));
            return;
          }
          const data = await readFile(metaFile, "utf8").catch(() => "{}");
          res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
          res.end(data);
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: error.message }));
        }
      }
    },
    {
      kind: "exact",
      path: "/bga-dsh-workbench/open",
      handler: async (req, res) => {
        try {
          const body = await readBody(req, 16 * 1024);
          const parsed = JSON.parse(body.toString("utf8"));
          const kind = parsed.kind;
          const path = parsed.path;
          if (!isOpenKind(kind) && !isExtraOpenKind(kind)) {
            throw new Error("kind must be one of: finder, terminal, vscode, or an extra IDE kind");
          }
          if (typeof path !== "string" || path.length === 0) {
            throw new Error("path must be a non-empty string");
          }
          if (!isAbsolute(path)) {
            throw new Error("path must be an absolute filesystem path");
          }
          const openConfig = runtime.resolve().open;
          const preference = {
            terminal: openConfig.terminal.length > 0 ? openConfig.terminal : void 0,
            editor: openConfig.editor.length > 0 ? openConfig.editor : void 0
          };
          const result = isExtraOpenKind(kind) ? await openExtraPathIn(kind, path) : await openPathIn(kind, path, { preference });
          if (result.ok) {
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(OK({}));
          } else {
            res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ ok: false, error: result.error ?? "failed to open" }));
          }
        } catch (error) {
          res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: error.message }));
        }
      }
    }
  ];
}

// src/english/routes.ts
import { unlink as unlink2 } from "node:fs/promises";
import { join as join4 } from "node:path";

// src/english/model.ts
var SRS_INTERVALS = [1, 3, 7, 15, 30, 60];
var DAILY_HEARTS = 5;
var KEYCHARS = "abcdefghijklmnopqrstuvwxyz0123456789";
function nanoid(length = 10) {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    const idx = Math.floor(Math.random() * KEYCHARS.length);
    out += KEYCHARS[idx];
  }
  return out;
}
function localDateKey(now = Date.now()) {
  const d = new Date(now);
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}
function dateDiff(a, b) {
  const [ay, am, ad] = a.split("-").map(Number);
  const [by, bm, bd] = b.split("-").map(Number);
  const A = new Date(ay, (am ?? 1) - 1, ad ?? 1).getTime();
  const B = new Date(by, (bm ?? 1) - 1, bd ?? 1).getTime();
  return Math.round((A - B) / 864e5);
}
function makeItem(text, meaning, example = "", type = "word", exampleMeaning = "") {
  return {
    id: nanoid(),
    type,
    text: text.trim(),
    meaning: meaning.trim(),
    example: example.trim(),
    exampleMeaning: exampleMeaning.trim(),
    status: "new",
    correctCount: 0,
    lastCorrectAt: null,
    nextReviewAt: 0,
    intervalDays: 1,
    ease: 2.5,
    xpEarned: 0
  };
}
function clampSessionSize(v) {
  const n = Number(v);
  return Number.isFinite(n) && n >= 1 && n <= 50 ? Math.round(n) : 5;
}
function makeCard(topic, mode, mastery, threshold, entries, targetLang = "en", sessionSize = 5) {
  return {
    id: nanoid(),
    topic: topic.trim(),
    mode,
    mastery,
    threshold,
    targetLang,
    sessionSize: clampSessionSize(sessionSize),
    createdAt: Date.now(),
    items: entries.map((entry) => makeItem(entry.text, entry.meaning, entry.example ?? "", entry.type ?? "word", entry.exampleMeaning ?? ""))
  };
}
function makeDefaultState() {
  return {
    cards: [],
    currentCardId: null,
    day: { date: localDateKey(), hearts: DAILY_HEARTS, completedToday: 0, correctToday: 0, wrongToday: 0 },
    streak: 0,
    lastActiveDate: null,
    xp: 0,
    totalCompleted: 0,
    totalAnswers: 0,
    statistics: { answers: 0, correct: 0, wrong: 0, xp: 0 },
    wrongWords: [],
    frequency: "every-turn",
    dailyQuizLimit: 10,
    quizzesToday: 0,
    quizzesDate: ""
  };
}
function normalizeAnswer(text) {
  return text.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.!?]+$/u, "");
}
function rollDay(state, now = Date.now()) {
  const today = localDateKey(now);
  if (state.day.date === today) return;
  state.day = {
    date: today,
    hearts: DAILY_HEARTS,
    completedToday: 0,
    correctToday: 0,
    wrongToday: 0
  };
}
function bumpStreak(state, now = Date.now()) {
  const today = localDateKey(now);
  if (state.lastActiveDate === null) {
    state.streak = 1;
  } else if (state.lastActiveDate === today) {
  } else {
    const gap = dateDiff(today, state.lastActiveDate);
    state.streak = gap === 1 ? state.streak + 1 : 1;
  }
  state.lastActiveDate = today;
}
function gradeAnswer(state, itemId, cardId, userText, now = Date.now()) {
  const card = state.cards.find((c) => c.id === cardId);
  const item = card?.items.find((it) => it.id === itemId);
  if (card === void 0 || item === void 0) {
    return {
      ok: "wrong",
      item: { ...makeItem("", "") },
      cardId,
      mastered: false,
      heartsLeft: state.day.hearts,
      xpDelta: 0,
      streak: state.streak,
      locked: false,
      answer: "",
      progress: { total: 0, mastered: 0, percent: 0 }
    };
  }
  rollDay(state, now);
  const correct = normalizeAnswer(userText) === normalizeAnswer(item.text);
  state.totalAnswers += 1;
  state.statistics.answers += 1;
  let xpDelta = 0;
  let mastered = false;
  if (correct) {
    state.statistics.correct += 1;
    state.day.correctToday += 1;
    item.correctCount += 1;
    item.lastCorrectAt = now;
    xpDelta = 10;
    bumpStreak(state, now);
    state.xp += xpDelta;
    state.statistics.xp += xpDelta;
    item.xpEarned += xpDelta;
    if (card.mastery === "count") {
      if (!isMastered(item) && item.correctCount >= card.threshold) {
        item.status = "mastered";
        mastered = true;
      } else if (!isMastered(item) && item.status !== "learning") {
        item.status = "learning";
      }
    } else {
      item.intervalDays = item.intervalDays >= SRS_INTERVALS[SRS_INTERVALS.length - 1] ? SRS_INTERVALS[SRS_INTERVALS.length - 1] : nextInterval(item.intervalDays);
      item.nextReviewAt = now + item.intervalDays * 864e5;
      item.ease = Math.min(3, item.ease + 0.1);
      const reviews = item.intervalDays;
      if (reviews >= 15) {
        item.status = "mastered";
        mastered = true;
      } else if (item.status !== "known") {
        item.status = reviews >= 7 ? "known" : "learning";
      }
    }
    if (mastered) {
      state.day.completedToday += 1;
      state.totalCompleted += 1;
    }
  } else {
    state.statistics.wrong += 1;
    state.day.wrongToday += 1;
    state.day.hearts = Math.max(0, state.day.hearts - 1);
    resetItemProgress(item);
    const existing = state.wrongWords.find((w) => w.itemId === item.id);
    if (existing) {
      existing.wrongCount += 1;
      existing.lastWrongAt = now;
    } else {
      state.wrongWords.push({
        itemId: item.id,
        cardId,
        text: item.text,
        meaning: item.meaning,
        example: item.example,
        wrongCount: 1,
        lastWrongAt: now,
        addedAt: now
      });
    }
  }
  return {
    ok: correct ? "correct" : "wrong",
    item,
    cardId,
    mastered,
    heartsLeft: state.day.hearts,
    xpDelta: correct ? xpDelta : -0,
    streak: state.streak,
    locked: state.day.hearts === 0,
    answer: item.text,
    progress: progressOf(card)
  };
}
function nextInterval(current) {
  for (const tier of SRS_INTERVALS) {
    if (tier > current) return tier;
  }
  return SRS_INTERVALS[SRS_INTERVALS.length - 1];
}
function isMastered(item) {
  return item.status === "mastered";
}
function resetItemProgress(item) {
  if (item.status === "mastered") return;
  item.status = "new";
  item.correctCount = Math.max(0, item.correctCount - 1);
  item.intervalDays = 1;
  item.nextReviewAt = 0;
}
function pickNextItem(card, now = Date.now()) {
  const learnable = card.items.filter((it) => !isMastered(it)).sort((a, b) => a.nextReviewAt - b.nextReviewAt);
  const due = learnable.filter((it) => it.nextReviewAt <= now || it.correctCount === 0);
  const pool = due.length > 0 ? due : learnable;
  return pool.length > 0 ? pool[Math.floor(Math.random() * pool.length)] : null;
}
function buildQuestion(card, item) {
  const base = {
    itemId: item.id,
    cardId: card.id,
    mode: card.mode,
    prompt: "",
    hint: "",
    answer: item.text,
    example: item.example
  };
  if (card.mode === "copy" || card.mode === "audio") {
    base.prompt = card.mode === "audio" ? "\u{1F3A7} \uFF08\u542C\u53D1\u97F3\u540E\u8F93\u5165\uFF09" : item.text;
    base.hint = item.meaning;
  } else if (card.mode === "recall") {
    base.prompt = item.meaning;
    base.hint = "\u8F93\u5165\u5BF9\u5E94\u7684\u82F1\u6587";
  } else {
    base.prompt = item.meaning;
    base.hint = "\u9009\u62E9\u6B63\u786E\u7684\u82F1\u6587";
    base.choices = buildChoices(card, item);
  }
  return base;
}
function buildChoices(card, item) {
  const others = card.items.filter((it) => it.id !== item.id && it.text !== item.text).map((it) => it.text);
  const seen = /* @__PURE__ */ new Set();
  const distractors = [];
  while (distractors.length < 3 && others.length > 0) {
    const idx = Math.floor(Math.random() * others.length);
    const candidate = others[idx];
    if (!seen.has(candidate)) {
      seen.add(candidate);
      distractors.push(candidate);
    }
    others.splice(idx, 1);
  }
  const pool = [...distractors, item.text];
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = pool[i];
    pool[i] = pool[j];
    pool[j] = tmp;
  }
  return pool.length >= 2 ? pool : [item.text];
}
function progressOf(card) {
  const mastered = card.items.filter(isMastered).length;
  const total = card.items.length;
  return { total, mastered, percent: total === 0 ? 0 : Math.round(mastered / total * 100) };
}
function publicState(state) {
  return {
    cards: state.cards.map((card) => ({
      id: card.id,
      topic: card.topic,
      mode: card.mode,
      mastery: card.mastery,
      threshold: card.threshold,
      targetLang: card.targetLang ?? "en",
      sessionSize: card.sessionSize ?? 5,
      locked: card.locked ?? false,
      createdAt: card.createdAt,
      progress: progressOf(card),
      items: card.items.map((it) => ({
        id: it.id,
        type: it.type,
        text: it.text,
        meaning: it.meaning,
        example: it.example,
        exampleMeaning: it.exampleMeaning,
        status: it.status,
        correctCount: it.correctCount,
        xpEarned: it.xpEarned
      }))
    })),
    currentCardId: state.currentCardId,
    day: { ...state.day },
    streak: state.streak,
    xp: state.xp,
    totalCompleted: state.totalCompleted,
    statistics: { ...state.statistics },
    badge: badgeForXp(state.xp),
    frequency: state.frequency,
    dailyQuizLimit: state.dailyQuizLimit,
    quizzesToday: state.quizzesToday,
    quizzesDate: state.quizzesDate
  };
}
function badgeForXp(xp) {
  const tiers = [
    { threshold: 0, name: "\u9752\u94DC" },
    { threshold: 200, name: "\u767D\u94F6" },
    { threshold: 500, name: "\u9EC4\u91D1" },
    { threshold: 1e3, name: "\u94C2\u91D1" },
    { threshold: 2e3, name: "\u94BB\u77F3" }
  ];
  let current = tiers[0];
  for (const tier of tiers) {
    if (xp >= tier.threshold) current = tier;
  }
  const index = tiers.findIndex((t) => t === current);
  const nextTier = tiers[index + 1];
  return {
    tier: index,
    name: current.name,
    next: nextTier === void 0 ? 0 : nextTier.threshold - current.threshold
  };
}
function exportState(state) {
  return JSON.stringify({ version: 1, exportedAt: Date.now(), ...state }, null, 2);
}
function parseImport(text) {
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed.cards)) return void 0;
    const def = makeDefaultState();
    def.cards = parsed.cards.filter(isPlausibleCard);
    def.currentCardId = parsed.currentCardId ?? null;
    def.xp = typeof parsed.xp === "number" ? parsed.xp : 0;
    def.statistics = { ...def.statistics, ...parsed.statistics ?? {} };
    def.totalCompleted = typeof parsed.totalCompleted === "number" ? parsed.totalCompleted : 0;
    rollDay(def);
    return def;
  } catch {
    return void 0;
  }
}
function isPlausibleCard(value) {
  if (typeof value !== "object" || value === null) return false;
  const card = value;
  if (typeof card.topic !== "string" || !Array.isArray(card.items)) return false;
  return true;
}

// src/english/routes.ts
init_builtin();

// src/english/generate.ts
import { createUserMessage } from "@deepseek-ai/dsh-llm";
var SYSTEM_PROMPT = "\u4F60\u662F\u4E13\u6CE8\u4E3A\u4E2D\u56FD\u82F1\u8BED\u5B66\u4E60\u8005\u751F\u6210\u8BCD\u6C47\u5B66\u4E60\u5185\u5BB9\u7684\u52A9\u624B\u3002\u53EA\u8F93\u51FA\u7528\u6237\u8981\u6C42\u7684 JSON\uFF0C\u4E0D\u8981\u4EFB\u4F55\u89E3\u91CA\u3002";
function userPrompt(topic, nativeLang, targetLang) {
  const langLabels = { zh: "\u4E2D\u6587", en: "English", ja: "\u65E5\u672C\u8A9E", ko: "\uD55C\uAD6D\uC5B4", es: "Espa\xF1ol", fr: "Fran\xE7ais", de: "Deutsch", pt: "Portugu\xEAs", ru: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439", ar: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" };
  const nativeLabel = langLabels[nativeLang ?? ""] ?? "\u4E2D\u6587";
  const isSimpleEnglish = targetLang === "en-simple";
  const targetLabel = isSimpleEnglish ? "Simple English" : langLabels[targetLang ?? ""] ?? "English";
  if (isSimpleEnglish) {
    return `\u8BF7\u4E3A\u4E3B\u9898\u300C${topic}\u300D\u751F\u6210\u9002\u5408\u5B66\u4E60 Simple English \u7684${nativeLabel}\u6BCD\u8BED\u8005\u5B66\u4E60\u5185\u5BB9\u3002Simple English \u53EA\u4F7F\u7528\u7EA6850\u4E2A\u6700\u57FA\u7840\u7684\u82F1\u8BED\u8BCD\u6C47\uFF08Basic English\uFF09\uFF0C\u53E5\u5B50\u7ED3\u6784\u4E5F\u5FC5\u987B\u7B80\u5355\u3002\u53EA\u8F93\u51FA\u4E00\u4E2A\u4E25\u683C JSON \u6570\u7EC4\uFF0C\u4E0D\u8981\u4EFB\u4F55\u5176\u5B83\u6587\u5B57\u3001\u4E0D\u8981 markdown \u4EE3\u7801\u5757\u3001\u4E0D\u8981\u524D\u540E\u7F00\u8BF4\u660E\u3002\u6570\u7EC4\u5143\u7D20\u6DF7\u5408\u5305\u542B\u4E24\u79CD\u7C7B\u578B\uFF1A1) \u5355\u8BCD/\u77ED\u8BED {"type":"word","text":"\u82F1\u6587\u5355\u8BCD\u6216\u77ED\u8BED\uFF08\u5FC5\u987B\u6765\u81EABasic English 850\u8BCD\u8868\uFF0C\u5982 need, give, good, water, work, think, come, go, take, make, see, know, say, get, put, run, eat, drink, play, stop, start, help, like, love, big, small, old, new, hot, cold, long, short, right, wrong, every, some, many, much, more, most, first, last, next, here, there, now, then, yes, no, not, and, but, or, with, for, from, into, about, before, after, over, under, up, down, off, on, in, out, at, by, to, of, is, are, was, were, have, has, had, can, could, will, would, shall, should, may, might, do, does, did \u7B49\uFF09","meaning":"${nativeLabel}\u91CA\u4E49","example":"\u7528\u4E0A\u8FF0\u7B80\u5355\u8BCD\u6C47\u7EC4\u6210\u7684\u4E00\u4E2A\u77ED\u4F8B\u53E5\uFF08\u4E0D\u8D85\u8FC710\u4E2A\u8BCD\uFF09","exampleMeaning":"\u4F8B\u53E5\u7684${nativeLabel}\u7FFB\u8BD1"}\uFF1B2) \u5B9E\u7528\u53E5\u5B50 {"type":"sentence","text":"\u4E00\u4E2A\u7B80\u77ED\u7684\u82F1\u6587\u53E5\u5B50\uFF08\u53EA\u7528Basic English\u8BCD\u6C47\uFF0C\u4E0D\u8D85\u8FC712\u4E2A\u8BCD\uFF09","meaning":"${nativeLabel}\u7FFB\u8BD1","example":"","exampleMeaning":""}\u3002\u5355\u8BCD\u548C\u53E5\u5B50\u5404\u81F3\u5C1110\u6761\uFF0C\u5177\u4F53\u6570\u91CF\u7531\u4F60\u6839\u636E\u4E3B\u9898\u7075\u6D3B\u51B3\u5B9A\u3002\u786E\u4FDD\u6BCF\u6761 text \u552F\u4E00\u3001\u7528\u8BCD\u6B63\u786E\u3001\u53EA\u4F7F\u7528\u6700\u57FA\u7840\u7684\u82F1\u8BED\u8BCD\u6C47\uFF0C\u9002\u5408\u82F1\u8BED\u521D\u5B66\u8005\u3002`;
  }
  return `\u8BF7\u4E3A\u4E3B\u9898\u300C${topic}\u300D\u751F\u6210\u9002\u5408\u5B66\u4E60${targetLabel}\u7684${nativeLabel}\u6BCD\u8BED\u8005\u5B66\u4E60\u5185\u5BB9\u3002\u53EA\u8F93\u51FA\u4E00\u4E2A\u4E25\u683C JSON \u6570\u7EC4\uFF0C\u4E0D\u8981\u4EFB\u4F55\u5176\u5B83\u6587\u5B57\u3001\u4E0D\u8981 markdown \u4EE3\u7801\u5757\u3001\u4E0D\u8981\u524D\u540E\u7F00\u8BF4\u660E\u3002\u6570\u7EC4\u5143\u7D20\u6DF7\u5408\u5305\u542B\u4E24\u79CD\u7C7B\u578B\uFF1A1) \u5355\u8BCD/\u77ED\u8BED {"type":"word","text":"${targetLabel}\u5355\u8BCD\u6216\u77ED\u8BED","meaning":"${nativeLabel}\u91CA\u4E49","example":"\u5305\u542B\u8BE5\u8BCD\u7684\u4E00\u4E2A${targetLabel}\u4F8B\u53E5","exampleMeaning":"\u4F8B\u53E5\u7684${nativeLabel}\u7FFB\u8BD1"}\uFF1B2) \u5B9E\u7528\u53E5\u5B50 {"type":"sentence","text":"\u4E00\u4E2A\u5B8C\u6574\u7684${targetLabel}\u53E5\u5B50","meaning":"${nativeLabel}\u7FFB\u8BD1","example":"","exampleMeaning":""}\u3002\u5355\u8BCD\u548C\u53E5\u5B50\u5404\u81F3\u5C1110\u6761\uFF0C\u5177\u4F53\u6570\u91CF\u7531\u4F60\u6839\u636E\u4E3B\u9898\u7075\u6D3B\u51B3\u5B9A\u3002\u786E\u4FDD\u6BCF\u6761 text \u552F\u4E00\u3001\u7528\u8BCD\u6B63\u786E\u3001\u96BE\u5EA6\u9002\u5408\u521D\u4E2D\u7EA7${targetLabel}\u5B66\u4E60\u8005\u3002`;
}
function describeFailure(reason) {
  const msg = reason.failure?.message;
  const code = reason.failure?.code;
  const detail = msg && msg.length > 0 ? msg : reason.kind;
  return code ? `\u6A21\u578B\u8BF7\u6C42\u5931\u8D25[${code}]\uFF1A${detail}` : `\u6A21\u578B\u8BF7\u6C42\u5931\u8D25\uFF1A${detail}`;
}
async function generateEnglishText(ctx, topic, selection, nativeLang, targetLang) {
  const llm = ctx.get("llm");
  if (llm === void 0) return void 0;
  let provider = selection?.provider;
  let model = selection?.model;
  if (provider === void 0 || model === void 0) {
    const defaultModel = ctx.get("agentDefaultModel");
    if (defaultModel !== void 0) {
      const current = defaultModel.currentSelection();
      provider = provider ?? current.provider;
      model = model ?? current.model;
    }
  }
  if (provider === void 0 || model === void 0) return void 0;
  const userMessage = createUserMessage({
    content: [{ type: "text", text: userPrompt(topic, nativeLang, targetLang) }],
    source: { kind: "user" }
  });
  let text = "";
  try {
    for await (const chunk of llm.stream({
      provider,
      model,
      system: SYSTEM_PROMPT,
      messages: [userMessage],
      temperature: 0.6
    })) {
      if (chunk.type === "text-delta" && typeof chunk.text === "string") text += chunk.text;
      else if (chunk.type === "finish") {
        const reason = chunk.reason;
        if (reason.kind === "error" || reason.kind === "aborted") {
          throw new Error(describeFailure(reason));
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("\u6A21\u578B\u8BF7\u6C42\u5931\u8D25")) throw error;
    throw new Error(`\u6A21\u578B\u8BF7\u6C42\u5931\u8D25\uFF1A${error?.message ?? String(error)}`);
  }
  const trimmed = text.trim();
  return trimmed.length > 0 ? trimmed : void 0;
}
function extractJson(text) {
  const start = text.search(/[\[{]/u);
  if (start < 0) return void 0;
  let depth = 0;
  let inString = false;
  let escape = false;
  let end = -1;
  for (let i = start; i < text.length; i += 1) {
    const ch = text[i];
    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (ch === "\\") escape = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "[" || ch === "{") {
      depth += 1;
      continue;
    }
    if (ch === "]" || ch === "}") {
      depth -= 1;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  if (end < 0) return void 0;
  try {
    return JSON.parse(text.slice(start, end));
  } catch {
    return void 0;
  }
}
async function listEnglishModels(ctx) {
  const llm = ctx.get("llm");
  if (llm === void 0) return [];
  try {
    const providers = llm.listProviders();
    const result = [];
    for (const provider of providers) {
      const models = await llm.listModels(provider.id);
      result.push({
        provider: provider.id,
        providerName: provider.name,
        models: models.map((m) => ({ id: m.id, name: m.name }))
      });
    }
    return result;
  } catch {
    return [];
  }
}

// src/english/store.ts
import { mkdir as mkdir2, readFile as readFile2, writeFile as writeFile2 } from "node:fs/promises";
import { join as join3 } from "node:path";

// src/english/basic-english-850.ts
var BASIC_ENGLISH_850 = [
  // ── Operations (15) ──
  { text: "come", meaning: "\u6765", example: "Please come to my home." },
  { text: "do", meaning: "\u505A", example: "What do you do every day?" },
  { text: "get", meaning: "\u5F97\u5230", example: "I want to get a good price." },
  { text: "give", meaning: "\u7ED9", example: "Give me the book, please." },
  { text: "go", meaning: "\u53BB", example: "We go to the park on Sunday." },
  { text: "keep", meaning: "\u4FDD\u6301", example: "Keep the room clean." },
  { text: "know", meaning: "\u77E5\u9053", example: "I know the right answer." },
  { text: "let", meaning: "\u8BA9", example: "Let me help you with that." },
  { text: "make", meaning: "\u5236\u4F5C", example: "She makes good food every day." },
  { text: "put", meaning: "\u653E", example: "Put the cup on the table." },
  { text: "say", meaning: "\u8BF4", example: "What did you say to him?" },
  { text: "see", meaning: "\u770B", example: "I can see the mountain from here." },
  { text: "send", meaning: "\u53D1\u9001", example: "Please send me the letter." },
  { text: "take", meaning: "\u62FF", example: "Take this pen with you." },
  { text: "think", meaning: "\u60F3", example: "I think this is the right way." },
  // ── Things (100) ──
  { text: "account", meaning: "\u8D26\u6237", example: "I have an account at the bank." },
  { text: "act", meaning: "\u884C\u4E3A", example: "That was a kind act." },
  { text: "action", meaning: "\u884C\u52A8", example: "Action is better than words." },
  { text: "adjustment", meaning: "\u8C03\u6574", example: "This adjustment will help." },
  { text: "advertisement", meaning: "\u5E7F\u544A", example: "I saw an advertisement on the wall." },
  { text: "agreement", meaning: "\u534F\u8BAE", example: "We have an agreement on this." },
  { text: "amount", meaning: "\u6570\u91CF", example: "A large amount of water fell." },
  { text: "angle", meaning: "\u89D2\u5EA6", example: "Look at this from every angle." },
  { text: "animal", meaning: "\u52A8\u7269", example: "The dog is a friendly animal." },
  { text: "answer", meaning: "\u56DE\u7B54", example: "Give me the right answer." },
  { text: "apparatus", meaning: "\u8BBE\u5907", example: "The apparatus works well." },
  { text: "apple", meaning: "\u82F9\u679C", example: "I eat an apple every day." },
  { text: "application", meaning: "\u7533\u8BF7", example: "Send in your application now." },
  { text: "arm", meaning: "\u624B\u81C2", example: "He broke his arm in the fall." },
  { text: "army", meaning: "\u519B\u961F", example: "The army protects the country." },
  { text: "art", meaning: "\u827A\u672F", example: "She studies art at school." },
  { text: "attack", meaning: "\u653B\u51FB", example: "The attack came at night." },
  { text: "attention", meaning: "\u6CE8\u610F", example: "Pay attention to the teacher." },
  { text: "attempt", meaning: "\u5C1D\u8BD5", example: "Make an attempt to solve it." },
  { text: "authority", meaning: "\u6743\u5A01", example: "He has authority over the group." },
  { text: "baby", meaning: "\u5A74\u513F", example: "The baby is sleeping now." },
  { text: "back", meaning: "\u80CC", example: "Put the bag on your back." },
  { text: "bag", meaning: "\u5305", example: "Carry this bag for me." },
  { text: "balance", meaning: "\u5E73\u8861", example: "Keep your balance on the ice." },
  { text: "base", meaning: "\u57FA\u7840", example: "The house has a strong base." },
  { text: "behavior", meaning: "\u884C\u4E3A", example: "Good behavior is important." },
  { text: "belief", meaning: "\u4FE1\u5FF5", example: "That is my belief on this matter." },
  { text: "birth", meaning: "\u51FA\u751F", example: "What is the date of your birth?" },
  { text: "bit", meaning: "\u4E00\u70B9\u513F", example: "Wait a bit and try again." },
  { text: "blood", meaning: "\u8840", example: "Blood is red in color." },
  { text: "blow", meaning: "\u5439", example: "The wind blows from the north." },
  { text: "board", meaning: "\u677F", example: "Write on the board, please." },
  { text: "boat", meaning: "\u8239", example: "We go across the water by boat." },
  { text: "body", meaning: "\u8EAB\u4F53", example: "Take good care of your body." },
  { text: "bomb", meaning: "\u70B8\u5F39", example: "The bomb was found by the army." },
  { text: "bone", meaning: "\u9AA8\u5934", example: "The dog likes to eat the bone." },
  { text: "book", meaning: "\u4E66", example: "I am reading a good book." },
  { text: "border", meaning: "\u8FB9\u754C", example: "We reached the border at noon." },
  { text: "bottom", meaning: "\u5E95\u90E8", example: "The key is at the bottom of the bag." },
  { text: "box", meaning: "\u76D2\u5B50", example: "Put the food in the box." },
  { text: "brain", meaning: "\u5927\u8111", example: "The brain controls the body." },
  { text: "branch", meaning: "\u6811\u679D", example: "A bird sat on the branch." },
  { text: "breath", meaning: "\u547C\u5438", example: "Take a deep breath now." },
  { text: "brother", meaning: "\u5144\u5F1F", example: "My brother is older than me." },
  { text: "building", meaning: "\u5EFA\u7B51", example: "That is a very tall building." },
  { text: "burn", meaning: "\u71C3\u70E7", example: "The fire burns very hot." },
  { text: "burst", meaning: "\u7206\u70B8", example: "The balloon may burst if you blow more." },
  { text: "button", meaning: "\u6309\u94AE", example: "Press the button to start." },
  { text: "camera", meaning: "\u76F8\u673A", example: "Take a photo with the camera." },
  { text: "camp", meaning: "\u8425\u5730", example: "We set up camp near the river." },
  { text: "cap", meaning: "\u5E3D\u5B50", example: "Wear your cap in the sun." },
  { text: "card", meaning: "\u5361\u7247", example: "Send her a birthday card." },
  { text: "cart", meaning: "\u624B\u63A8\u8F66", example: "Put the bags in the cart." },
  { text: "case", meaning: "\u7BB1\u5B50", example: "The case is full of clothes." },
  { text: "cat", meaning: "\u732B", example: "The cat is on the chair." },
  { text: "center", meaning: "\u4E2D\u5FC3", example: "The store is in the center of town." },
  { text: "chain", meaning: "\u94FE\u5B50", example: "The chain is made of metal." },
  { text: "chair", meaning: "\u6905\u5B50", example: "Sit down on this chair." },
  { text: "chance", meaning: "\u673A\u4F1A", example: "Give me a chance to try." },
  { text: "check", meaning: "\u68C0\u67E5", example: "Check your work before you finish." },
  { text: "church", meaning: "\u6559\u5802", example: "We go to church on Sunday." },
  { text: "circle", meaning: "\u5706", example: "Draw a circle on the paper." },
  { text: "citizen", meaning: "\u516C\u6C11", example: "Every citizen has a right to vote." },
  { text: "cloud", meaning: "\u4E91", example: "The cloud is dark and big." },
  { text: "coat", meaning: "\u5916\u5957", example: "Wear your coat, it is cold." },
  { text: "color", meaning: "\u989C\u8272", example: "What color do you like best?" },
  { text: "column", meaning: "\u67F1", example: "The column holds up the roof." },
  { text: "comb", meaning: "\u68B3\u5B50", example: "Use a comb for your hair." },
  { text: "comfort", meaning: "\u8212\u9002", example: "This chair gives me great comfort." },
  { text: "command", meaning: "\u547D\u4EE4", example: "Give the command to start." },
  { text: "company", meaning: "\u516C\u53F8", example: "He works for a big company." },
  { text: "control", meaning: "\u63A7\u5236", example: "Who is in control here?" },
  { text: "cotton", meaning: "\u68C9\u82B1", example: "This shirt is made of cotton." },
  { text: "cough", meaning: "\u54B3\u55FD", example: "He has a bad cough today." },
  { text: "country", meaning: "\u56FD\u5BB6", example: "This is a beautiful country." },
  { text: "cover", meaning: "\u8986\u76D6", example: "Cover the pot with a lid." },
  { text: "crack", meaning: "\u88C2\u7F1D", example: "There is a crack in the wall." },
  { text: "credit", meaning: "\u4FE1\u7528", example: "He has good credit at the bank." },
  { text: "crowd", meaning: "\u4EBA\u7FA4", example: "A large crowd came to the show." },
  { text: "cup", meaning: "\u676F\u5B50", example: "Pour some tea in the cup." },
  { text: "current", meaning: "\u6C34\u6D41", example: "The current in the river is strong." },
  { text: "curve", meaning: "\u66F2\u7EBF", example: "The road has a big curve here." },
  { text: "damage", meaning: "\u635F\u5BB3", example: "The storm caused much damage." },
  { text: "danger", meaning: "\u5371\u9669", example: "There is danger in the old house." },
  { text: "daughter", meaning: "\u5973\u513F", example: "Their daughter is very kind." },
  { text: "day", meaning: "\u5929", example: "Today is a good day to start." },
  { text: "death", meaning: "\u6B7B\u4EA1", example: "His death was a great loss." },
  { text: "design", meaning: "\u8BBE\u8BA1", example: "She made a beautiful design." },
  { text: "desire", meaning: "\u6B32\u671B", example: "My desire is to help others." },
  { text: "destruction", meaning: "\u7834\u574F", example: "The destruction of the building was total." },
  { text: "detail", meaning: "\u7EC6\u8282", example: "Tell me every detail of the plan." },
  { text: "development", meaning: "\u53D1\u5C55", example: "The development of this city is fast." },
  { text: "digestion", meaning: "\u6D88\u5316", example: "Good food helps your digestion." },
  { text: "able", meaning: "\u80FD\u591F", example: "I am able to swim well." },
  { text: "abnormal", meaning: "\u5F02\u5E38", example: "That is abnormal behavior." },
  { text: "abroad", meaning: "\u56FD\u5916", example: "She lives abroad now." },
  { text: "absent", meaning: "\u7F3A\u5E2D", example: "He was absent from class." },
  { text: "absolute", meaning: "\u7EDD\u5BF9", example: "That is the absolute truth." },
  { text: "accept", meaning: "\u63A5\u53D7", example: "Please accept my gift." },
  { text: "accident", meaning: "\u4E8B\u6545", example: "The accident happened at noon." },
  // ── General Words (300) ──
  { text: "actual", meaning: "\u5B9E\u9645", example: "What is the actual number?" },
  { text: "add", meaning: "\u52A0", example: "Add two more to the list." },
  { text: "adult", meaning: "\u6210\u4EBA", example: "Every adult must vote." },
  { text: "afraid", meaning: "\u5BB3\u6015", example: "I am afraid of the dark." },
  { text: "agree", meaning: "\u540C\u610F", example: "I agree with your idea." },
  { text: "ahead", meaning: "\u524D\u9762", example: "Go ahead and start now." },
  { text: "alive", meaning: "\u6D3B\u7740", example: "The fish is still alive." },
  { text: "allow", meaning: "\u5141\u8BB8", example: "Do not allow him to go." },
  { text: "alone", meaning: "\u72EC\u81EA", example: "She lives alone in the city." },
  { text: "among", meaning: "\u5728\u2026\u4E4B\u4E2D", example: "He is the best among them." },
  { text: "apart", meaning: "\u5206\u5F00", example: "Put the two things apart." },
  { text: "apologize", meaning: "\u9053\u6B49", example: "I must apologize for being late." },
  { text: "appear", meaning: "\u51FA\u73B0", example: "The sun appears at dawn." },
  { text: "approve", meaning: "\u8D5E\u6210", example: "The group will approve the plan." },
  { text: "around", meaning: "\u5468\u56F4", example: "Look around and tell me what you see." },
  { text: "arrive", meaning: "\u5230\u8FBE", example: "We arrive at the station at nine." },
  { text: "aside", meaning: "\u65C1\u8FB9", example: "Put it aside for later." },
  { text: "associate", meaning: "\u8054\u7CFB", example: "I associate music with joy." },
  { text: "attach", meaning: "\u9644\u4E0A", example: "Attach the file to the letter." },
  { text: "available", meaning: "\u53EF\u7528", example: "Is this seat available?" },
  { text: "average", meaning: "\u5E73\u5747", example: "The average age is thirty." },
  { text: "avoid", meaning: "\u907F\u514D", example: "Avoid going out in the rain." },
  { text: "awake", meaning: "\u9192\u7740", example: "I was awake all night long." },
  { text: "aware", meaning: "\u610F\u8BC6\u5230", example: "Are you aware of the danger?" },
  { text: "bad", meaning: "\u574F", example: "That is a bad idea for sure." },
  { text: "basic", meaning: "\u57FA\u672C", example: "These are the basic rules." },
  { text: "beautiful", meaning: "\u7F8E\u4E3D", example: "That is a beautiful picture." },
  { text: "bed", meaning: "\u5E8A", example: "Go to bed now, it is late." },
  { text: "bend", meaning: "\u5F2F\u66F2", example: "Bend your knees when you lift." },
  { text: "best", meaning: "\u6700\u597D", example: "This is the best day of my life." },
  { text: "bitter", meaning: "\u82E6", example: "This medicine has a bitter taste." },
  { text: "black", meaning: "\u9ED1\u8272", example: "The cat has black fur." },
  { text: "blue", meaning: "\u84DD\u8272", example: "The sky is blue today." },
  { text: "bold", meaning: "\u5927\u80C6", example: "That was a very bold action." },
  { text: "born", meaning: "\u51FA\u751F", example: "I was born in this town." },
  { text: "both", meaning: "\u4E24\u8005\u90FD", example: "Both of them are good." },
  { text: "bright", meaning: "\u660E\u4EAE", example: "The light is very bright." },
  { text: "broad", meaning: "\u5BBD", example: "The road is very broad here." },
  { text: "brown", meaning: "\u68D5\u8272", example: "The table is dark brown." },
  { text: "busy", meaning: "\u5FD9\u788C", example: "I am very busy today." },
  { text: "calm", meaning: "\u5E73\u9759", example: "Keep calm and carry on." },
  { text: "capable", meaning: "\u6709\u80FD\u529B", example: "She is capable of doing the work." },
  { text: "care", meaning: "\u5173\u5FC3", example: "Take care of yourself." },
  { text: "careful", meaning: "\u5C0F\u5FC3", example: "Be careful when you cross the road." },
  { text: "certain", meaning: "\u786E\u5B9A", example: "I am certain he will come." },
  { text: "cheap", meaning: "\u4FBF\u5B9C", example: "This book is very cheap." },
  { text: "clear", meaning: "\u6E05\u695A", example: "Make your answer clear and simple." },
  { text: "clever", meaning: "\u806A\u660E", example: "That was a clever idea." },
  { text: "close", meaning: "\u8FD1", example: "The store is close to my home." },
  { text: "cold", meaning: "\u51B7", example: "It is very cold outside today." },
  { text: "comfortable", meaning: "\u8212\u9002", example: "This chair is very comfortable." },
  { text: "common", meaning: "\u5E38\u89C1", example: "That is a common problem." },
  { text: "complete", meaning: "\u5B8C\u6574", example: "Is the report complete now?" },
  { text: "concerned", meaning: "\u5173\u5FC3", example: "I am concerned about your health." },
  { text: "content", meaning: "\u6EE1\u8DB3", example: "Are you content with this result?" },
  { text: "continue", meaning: "\u7EE7\u7EED", example: "Please continue with your story." },
  { text: "correct", meaning: "\u6B63\u786E", example: "That is the correct answer." },
  { text: "cost", meaning: "\u82B1\u8D39", example: "What does this cost in total?" },
  { text: "cross", meaning: "\u7A7F\u8FC7", example: "Cross the road at the light." },
  { text: "crowded", meaning: "\u62E5\u6324", example: "The bus is very crowded today." },
  { text: "cruel", meaning: "\u6B8B\u5FCD", example: "It is cruel to hurt animals." },
  { text: "daily", meaning: "\u6BCF\u5929", example: "I take a daily walk in the park." },
  { text: "deep", meaning: "\u6DF1", example: "The river is very deep here." },
  { text: "definite", meaning: "\u660E\u786E", example: "Give me a definite answer." },
  { text: "delicate", meaning: "\u7CBE\u81F4", example: "This is a very delicate piece of art." },
  { text: "delightful", meaning: "\u4EE4\u4EBA\u6109\u5FEB", example: "We had a delightful time." },
  { text: "different", meaning: "\u4E0D\u540C", example: "The two books are very different." },
  { text: "difficult", meaning: "\u56F0\u96BE", example: "This question is very difficult." },
  { text: "direct", meaning: "\u76F4\u63A5", example: "Take the direct road to the city." },
  { text: "dirty", meaning: "\u810F", example: "Your hands are very dirty." },
  { text: "dry", meaning: "\u5E72", example: "The cloth is now dry and clean." },
  { text: "early", meaning: "\u65E9", example: "She always gets up early." },
  { text: "east", meaning: "\u4E1C\u65B9", example: "The sun rises in the east." },
  { text: "easy", meaning: "\u5BB9\u6613", example: "This test is very easy for me." },
  { text: "effect", meaning: "\u6548\u679C", example: "What is the effect of this medicine?" },
  { text: "efficient", meaning: "\u9AD8\u6548", example: "She is an efficient worker." },
  { text: "else", meaning: "\u5176\u4ED6", example: "What else do you need now?" },
  { text: "empty", meaning: "\u7A7A", example: "The room is empty and clean." },
  { text: "end", meaning: "\u7ED3\u675F", example: "At the end of the road turn left." },
  { text: "equal", meaning: "\u5E73\u7B49", example: "All people are equal in this land." },
  { text: "especial", meaning: "\u7279\u522B", example: "This is of especial importance." },
  { text: "even", meaning: "\u751A\u81F3", example: "Even a child can do this." },
  { text: "eventual", meaning: "\u6700\u7EC8", example: "His eventual success was great." },
  { text: "evil", meaning: "\u90AA\u6076", example: "That was an evil plan." },
  { text: "exact", meaning: "\u7CBE\u786E", example: "Tell me the exact time." },
  { text: "excellent", meaning: "\u4F18\u79C0", example: "That is an excellent idea." },
  { text: "except", meaning: "\u9664\u4E86", example: "Everyone came except Tom." },
  { text: "excited", meaning: "\u5174\u594B", example: "I am excited about the trip." },
  { text: "exciting", meaning: "\u4EE4\u4EBA\u5174\u594B", example: "That was an exciting game." },
  { text: "existing", meaning: "\u73B0\u6709\u7684", example: "We must use the existing plan." },
  { text: "extra", meaning: "\u989D\u5916", example: "Do you have any extra time?" },
  { text: "extreme", meaning: "\u6781\u7AEF", example: "That is an extreme case." },
  { text: "fact", meaning: "\u4E8B\u5B9E", example: "That is a known fact to everyone." },
  { text: "fair", meaning: "\u516C\u5E73", example: "We must be fair to all people." },
  { text: "false", meaning: "\u9519\u8BEF", example: "That statement is false and wrong." },
  { text: "familiar", meaning: "\u719F\u6089", example: "This place looks familiar to me." },
  { text: "far", meaning: "\u8FDC", example: "The town is far from here." },
  { text: "fast", meaning: "\u5FEB", example: "He can run very fast indeed." },
  { text: "fat", meaning: "\u80D6", example: "The cat is getting too fat." },
  { text: "few", meaning: "\u5C11", example: "Only a few people came today." },
  { text: "final", meaning: "\u6700\u540E", example: "This is the final decision." },
  { text: "fine", meaning: "\u597D", example: "I am feeling fine today." },
  { text: "firm", meaning: "\u575A\u5B9A", example: "Be firm in your decisions." },
  { text: "flat", meaning: "\u5E73", example: "The road is flat and smooth." },
  { text: "foreign", meaning: "\u5916\u56FD", example: "He studies a foreign language." },
  { text: "former", meaning: "\u524D\u8005", example: "The former plan was better." },
  { text: "free", meaning: "\u81EA\u7531", example: "You are free to go now." },
  { text: "frequent", meaning: "\u9891\u7E41", example: "He is a frequent visitor here." },
  { text: "fresh", meaning: "\u65B0\u9C9C", example: "We have fresh bread every morning." },
  { text: "front", meaning: "\u524D\u9762", example: "Stand at the front of the line." },
  { text: "full", meaning: "\u6EE1", example: "The glass is full of water." },
  { text: "general", meaning: "\u4E00\u822C", example: "This is the general rule for all." },
  { text: "gentle", meaning: "\u6E29\u67D4", example: "Be gentle with the small child." },
  { text: "genuine", meaning: "\u771F\u6B63\u7684", example: "This is a genuine piece of art." },
  { text: "glad", meaning: "\u9AD8\u5174", example: "I am glad to see you again." },
  { text: "gold", meaning: "\u91D1\u5B50", example: "The ring is made of gold." },
  { text: "good", meaning: "\u597D", example: "That is a very good idea." },
  { text: "gray", meaning: "\u7070\u8272", example: "The cat has gray fur." },
  { text: "great", meaning: "\u4F1F\u5927", example: "That was a great success." },
  { text: "green", meaning: "\u7EFF\u8272", example: "The grass is green in spring." },
  { text: "guilty", meaning: "\u6709\u7F6A", example: "He was found guilty at court." },
  { text: "happy", meaning: "\u5FEB\u4E50", example: "I am very happy today." },
  { text: "hard", meaning: "\u786C", example: "This work is very hard to do." },
  { text: "heavy", meaning: "\u91CD", example: "The box is too heavy for me." },
  { text: "high", meaning: "\u9AD8", example: "The mountain is very high." },
  { text: "hollow", meaning: "\u7A7A\u5FC3", example: "The tree is hollow inside." },
  { text: "honest", meaning: "\u8BDA\u5B9E", example: "He is an honest person." },
  { text: "hot", meaning: "\u70ED", example: "The water is very hot today." },
  { text: "huge", meaning: "\u5DE8\u5927", example: "That is a huge building." },
  { text: "ill", meaning: "\u751F\u75C5", example: "She has been ill for three days." },
  { text: "important", meaning: "\u91CD\u8981", example: "This is an important meeting." },
  { text: "impossible", meaning: "\u4E0D\u53EF\u80FD", example: "Nothing is impossible if you try." },
  { text: "indeed", meaning: "\u786E\u5B9E", example: "That is indeed very kind of you." },
  { text: "independent", meaning: "\u72EC\u7ACB", example: "She is a very independent person." },
  { text: "industrial", meaning: "\u5DE5\u4E1A", example: "This is an industrial area of town." },
  { text: "intelligent", meaning: "\u806A\u660E", example: "She is very intelligent and kind." },
  { text: "interested", meaning: "\u611F\u5174\u8DA3", example: "I am interested in this subject." },
  { text: "interesting", meaning: "\u6709\u8DA3", example: "That is a very interesting book." },
  { text: "international", meaning: "\u56FD\u9645", example: "This is an international event." },
  { text: "just", meaning: "\u516C\u6B63", example: "That was the just decision." },
  { text: "keen", meaning: "\u70ED\u5207", example: "He is keen on learning languages." },
  { text: "last", meaning: "\u6700\u540E", example: "That was the last time I saw him." },
  { text: "late", meaning: "\u8FDF", example: "You are late for the meeting." },
  { text: "left", meaning: "\u5DE6", example: "Turn left at the next corner." },
  { text: "less", meaning: "\u8F83\u5C11", example: "Use less sugar in your tea." },
  { text: "level", meaning: "\u6C34\u5E73", example: "Keep the water at this level." },
  { text: "light", meaning: "\u8F7B", example: "This bag is light to carry." },
  { text: "likely", meaning: "\u53EF\u80FD", example: "It is likely to rain today." },
  { text: "limited", meaning: "\u6709\u9650", example: "We have limited time today." },
  { text: "liquid", meaning: "\u6DB2\u4F53", example: "Water is a clear liquid." },
  { text: "little", meaning: "\u5C0F", example: "I have a little dog at home." },
  { text: "local", meaning: "\u5F53\u5730", example: "The local store is very near." },
  { text: "long", meaning: "\u957F", example: "The road is very long and straight." },
  { text: "loose", meaning: "\u677E", example: "The rope is loose and will fall." },
  { text: "low", meaning: "\u4F4E", example: "The temperature is very low today." },
  { text: "lucky", meaning: "\u5E78\u8FD0", example: "I am lucky to have good friends." },
  { text: "main", meaning: "\u4E3B\u8981", example: "What is the main reason for this?" },
  { text: "major", meaning: "\u91CD\u5927", example: "That was a major change for us." },
  { text: "male", meaning: "\u7537\u6027", example: "He is the only male in the group." },
  { text: "married", meaning: "\u5DF2\u5A5A", example: "They got married last year." },
  { text: "material", meaning: "\u6750\u6599", example: "What material is this made of?" },
  { text: "maximum", meaning: "\u6700\u5927", example: "The maximum speed is one hundred." },
  { text: "medical", meaning: "\u533B\u5B66", example: "She needs medical help now." },
  { text: "mental", meaning: "\u7CBE\u795E", example: "He has good mental health." },
  { text: "mild", meaning: "\u6E29\u548C", example: "The weather is mild today." },
  { text: "military", meaning: "\u519B\u4E8B", example: "He served in the military for years." },
  { text: "minimum", meaning: "\u6700\u5C0F", example: "The minimum age is eighteen." },
  { text: "modern", meaning: "\u73B0\u4EE3", example: "This is a very modern building." },
  { text: "moral", meaning: "\u9053\u5FB7", example: "That is the moral thing to do." },
  { text: "more", meaning: "\u66F4\u591A", example: "Give me more time to finish." },
  { text: "most", meaning: "\u6700\u591A", example: "Most people like good food." },
  { text: "much", meaning: "\u5F88\u591A", example: "Thank you very much for this." },
  { text: "narrow", meaning: "\u7A84", example: "The street is very narrow here." },
  { text: "national", meaning: "\u56FD\u5BB6", example: "This is a national holiday today." },
  { text: "natural", meaning: "\u81EA\u7136", example: "It is natural to feel this way." },
  { text: "near", meaning: "\u8FD1", example: "The school is very near to us." },
  { text: "neat", meaning: "\u6574\u6D01", example: "Her room is always neat and clean." },
  { text: "necessary", meaning: "\u5FC5\u8981", example: "Sleep is necessary for health." },
  { text: "new", meaning: "\u65B0", example: "I bought a new book today." },
  { text: "next", meaning: "\u4E0B\u4E00\u4E2A", example: "See me next Monday morning." },
  { text: "nice", meaning: "\u597D", example: "That is a very nice dress." },
  { text: "normal", meaning: "\u6B63\u5E38", example: "Everything is back to normal." },
  { text: "north", meaning: "\u5317\u65B9", example: "The wind comes from the north." },
  { text: "noted", meaning: "\u8457\u540D", example: "He is a noted artist in this city." },
  { text: "obvious", meaning: "\u660E\u663E", example: "That is the obvious answer." },
  { text: "odd", meaning: "\u5947\u602A", example: "That was an odd thing to say." },
  { text: "old", meaning: "\u8001", example: "My grandfather is very old." },
  { text: "opposite", meaning: "\u76F8\u53CD", example: "They live on the opposite side." },
  { text: "ordinary", meaning: "\u666E\u901A", example: "This is just an ordinary day." },
  { text: "organized", meaning: "\u6709\u7EC4\u7EC7", example: "She is a very organized person." },
  { text: "other", meaning: "\u5176\u4ED6", example: "All the other books are new." },
  { text: "own", meaning: "\u81EA\u5DF1\u7684", example: "I have my own room now." },
  { text: "particular", meaning: "\u7279\u5B9A", example: "Is there a particular reason?" },
  { text: "past", meaning: "\u8FC7\u53BB", example: "In the past we lived here." },
  { text: "personal", meaning: "\u4E2A\u4EBA", example: "This is my personal opinion." },
  { text: "plain", meaning: "\u7B80\u5355", example: "Give me a plain answer." },
  { text: "pleasant", meaning: "\u6109\u5FEB", example: "We had a pleasant time today." },
  { text: "pleased", meaning: "\u9AD8\u5174", example: "I am pleased with the result." },
  { text: "political", meaning: "\u653F\u6CBB", example: "That is a political question." },
  { text: "poor", meaning: "\u7A77", example: "They were poor when young." },
  { text: "popular", meaning: "\u53D7\u6B22\u8FCE", example: "This song is very popular." },
  { text: "positive", meaning: "\u79EF\u6781", example: "Try to have a positive mind." },
  { text: "possible", meaning: "\u53EF\u80FD", example: "It is possible to finish on time." },
  { text: "powerful", meaning: "\u5F3A\u5927", example: "That is a very powerful machine." },
  { text: "present", meaning: "\u76EE\u524D", example: "At the present time we are safe." },
  { text: "previous", meaning: "\u4E4B\u524D", example: "The previous owner was kind." },
  { text: "primary", meaning: "\u4E3B\u8981", example: "This is the primary reason." },
  { text: "private", meaning: "\u79C1\u4EBA", example: "This is my private space now." },
  { text: "progress", meaning: "\u8FDB\u6B65", example: "You are making good progress." },
  { text: "proper", meaning: "\u9002\u5F53", example: "Use the proper tool for this." },
  { text: "public", meaning: "\u516C\u5171", example: "This is a public park for all." },
  { text: "pure", meaning: "\u7EAF", example: "This is pure water from the well." },
  { text: "quick", meaning: "\u5FEB", example: "Give me a quick answer now." },
  { text: "quiet", meaning: "\u5B89\u9759", example: "Please be quiet in the library." },
  { text: "rapid", meaning: "\u8FC5\u901F", example: "There has been rapid growth." },
  { text: "ready", meaning: "\u51C6\u5907\u597D", example: "Are you ready to go now?" },
  { text: "real", meaning: "\u771F\u5B9E", example: "Is this a real diamond ring?" },
  { text: "reasonable", meaning: "\u5408\u7406", example: "That is a reasonable price." },
  { text: "recent", meaning: "\u6700\u8FD1", example: "I saw him in recent days." },
  { text: "red", meaning: "\u7EA2\u8272", example: "She wore a red dress today." },
  { text: "regular", meaning: "\u89C4\u5F8B", example: "Take regular exercise every day." },
  { text: "responsible", meaning: "\u8D1F\u8D23", example: "He is responsible for this work." },
  { text: "rich", meaning: "\u5BCC\u6709", example: "She comes from a rich family." },
  { text: "right", meaning: "\u6B63\u786E", example: "You are right about this matter." },
  { text: "rough", meaning: "\u7C97\u7CD9", example: "The road is rough and bumpy." },
  { text: "round", meaning: "\u5706", example: "The table is round in shape." },
  { text: "sad", meaning: "\u60B2\u4F24", example: "She looked very sad today." },
  { text: "safe", meaning: "\u5B89\u5168", example: "The children are safe at home." },
  { text: "same", meaning: "\u76F8\u540C", example: "We wear the same color today." },
  { text: "satisfied", meaning: "\u6EE1\u610F", example: "I am satisfied with the work." },
  { text: "secret", meaning: "\u79D8\u5BC6", example: "Keep this as a secret between us." },
  { text: "serious", meaning: "\u4E25\u8083", example: "This is a very serious matter." },
  { text: "sharp", meaning: "\u950B\u5229", example: "Be careful, the knife is sharp." },
  { text: "short", meaning: "\u77ED", example: "This road is short and easy." },
  { text: "shut", meaning: "\u5173\u95ED", example: "Please shut the door behind you." },
  { text: "sick", meaning: "\u751F\u75C5", example: "He is too sick to go to work." },
  { text: "simple", meaning: "\u7B80\u5355", example: "The answer is very simple." },
  { text: "single", meaning: "\u5355\u4E00", example: "This is the single best way." },
  { text: "slow", meaning: "\u6162", example: "Please drive slow on this road." },
  { text: "small", meaning: "\u5C0F", example: "I live in a small but nice house." },
  { text: "smart", meaning: "\u806A\u660E", example: "She is a very smart student." },
  { text: "soft", meaning: "\u8F6F", example: "This pillow is very soft." },
  { text: "solid", meaning: "\u56FA\u4F53", example: "Water becomes solid when frozen." },
  { text: "sorry", meaning: "\u5BF9\u4E0D\u8D77", example: "I am sorry I was late today." },
  { text: "south", meaning: "\u5357\u65B9", example: "The birds fly south in winter." },
  { text: "spare", meaning: "\u5907\u7528", example: "Do you have a spare key?" },
  { text: "special", meaning: "\u7279\u522B", example: "Today is a very special day." },
  { text: "standard", meaning: "\u6807\u51C6", example: "This is the standard way to do it." },
  { text: "steady", meaning: "\u7A33\u5B9A", example: "Keep a steady speed while driving." },
  { text: "strange", meaning: "\u5947\u602A", example: "That was a strange thing to see." },
  { text: "strong", meaning: "\u5F3A\u58EE", example: "He is a very strong man." },
  { text: "sudden", meaning: "\u7A81\u7136", example: "There was a sudden loud noise." },
  { text: "suitable", meaning: "\u5408\u9002", example: "This is suitable for all ages." },
  { text: "sure", meaning: "\u786E\u5B9A", example: "I am sure about this answer." },
  { text: "sweet", meaning: "\u751C", example: "This fruit is very sweet to eat." },
  { text: "tall", meaning: "\u9AD8", example: "That building is very tall indeed." },
  { text: "tender", meaning: "\u6E29\u67D4", example: "She spoke in a tender voice." },
  { text: "terrible", meaning: "\u53EF\u6015", example: "That was a terrible accident." },
  { text: "thick", meaning: "\u539A", example: "This book is very thick and heavy." },
  { text: "tight", meaning: "\u7D27", example: "The lid is too tight to open." },
  { text: "tiny", meaning: "\u6781\u5C0F", example: "The baby has tiny little hands." },
  { text: "tired", meaning: "\u7D2F", example: "I am very tired after work." },
  { text: "total", meaning: "\u603B\u5171", example: "What is the total cost of this?" },
  { text: "tough", meaning: "\u575A\u97E7", example: "This material is very tough." },
  { text: "true", meaning: "\u771F\u5B9E", example: "That is a true story about me." },
  { text: "typical", meaning: "\u5178\u578B", example: "This is a typical day at work." },
  { text: "ugly", meaning: "\u4E11", example: "That is an ugly building indeed." },
  { text: "uncertain", meaning: "\u4E0D\u786E\u5B9A", example: "The future is uncertain for all." },
  { text: "under", meaning: "\u5728\u2026\u4E0B", example: "The cat is under the table now." },
  { text: "unfortunate", meaning: "\u4E0D\u5E78", example: "That was an unfortunate event." },
  { text: "unique", meaning: "\u72EC\u7279", example: "Every person is unique and special." },
  { text: "united", meaning: "\u8054\u5408", example: "They are united as one group." },
  { text: "unlikely", meaning: "\u4E0D\u592A\u53EF\u80FD", example: "It is unlikely to snow today." },
  { text: "usual", meaning: "\u901A\u5E38", example: "I take the usual bus to work." },
  { text: "various", meaning: "\u5404\u79CD", example: "There are various kinds of food." },
  { text: "violent", meaning: "\u66B4\u529B", example: "The storm was very violent today." },
  { text: "visible", meaning: "\u53EF\u89C1", example: "The stars are visible tonight." },
  { text: "vital", meaning: "\u91CD\u8981", example: "Water is vital for all life." },
  { text: "warm", meaning: "\u6E29\u6696", example: "The room is nice and warm today." },
  { text: "weak", meaning: "\u5F31", example: "He felt weak after the long illness." },
  { text: "well", meaning: "\u597D", example: "She speaks very well in public." },
  { text: "west", meaning: "\u897F\u65B9", example: "The sun goes down in the west." },
  { text: "white", meaning: "\u767D\u8272", example: "The snow is white and clean." },
  { text: "wide", meaning: "\u5BBD", example: "The river is very wide at this point." },
  { text: "wild", meaning: "\u91CE\u751F", example: "There are wild animals in the forest." },
  { text: "wise", meaning: "\u660E\u667A", example: "That was a very wise decision." },
  { text: "wrong", meaning: "\u9519\u8BEF", example: "You gave the wrong answer to me." },
  { text: "ability", meaning: "\u80FD\u529B", example: "She has the ability to lead." },
  { text: "absence", meaning: "\u7F3A\u5E2D", example: "His absence was noted by all." },
  { text: "addition", meaning: "\u6DFB\u52A0", example: "This is a good addition to the plan." },
  { text: "adventure", meaning: "\u5192\u9669", example: "The trip was a great adventure." },
  { text: "advice", meaning: "\u5EFA\u8BAE", example: "He gave me some good advice." },
  { text: "age", meaning: "\u5E74\u9F84", example: "What is your age in years?" },
  { text: "aim", meaning: "\u76EE\u6807", example: "What is your aim in life?" },
  { text: "alarm", meaning: "\u8B66\u62A5", example: "The alarm went off at six." },
  { text: "anger", meaning: "\u6124\u6012", example: "He showed his anger at the news." },
  { text: "anxiety", meaning: "\u7126\u8651", example: "She felt great anxiety before the test." },
  { text: "area", meaning: "\u5730\u533A", example: "This area is very quiet at night." },
  { text: "argument", meaning: "\u4E89\u8BBA", example: "We had a big argument about this." },
  { text: "battle", meaning: "\u6218\u6597", example: "The battle lasted for many hours." },
  // ── Abstract Words (435) ──
  { text: "beauty", meaning: "\u7F8E\u4E3D", example: "The beauty of the sunset was great." },
  { text: "blessing", meaning: "\u795D\u798F", example: "Having family is a blessing." },
  { text: "business", meaning: "\u5546\u4E1A", example: "Business is good this year." },
  { text: "capacity", meaning: "\u5BB9\u91CF", example: "The capacity of the room is fifty." },
  { text: "cause", meaning: "\u539F\u56E0", example: "What is the cause of this problem?" },
  { text: "change", meaning: "\u53D8\u5316", example: "Change is always a good thing." },
  { text: "charge", meaning: "\u8D1F\u8D23", example: "Who is in charge of this project?" },
  { text: "cheer", meaning: "\u6B22\u547C", example: "Give a cheer for the team now." },
  { text: "choice", meaning: "\u9009\u62E9", example: "You have a choice to make here." },
  { text: "comparison", meaning: "\u6BD4\u8F83", example: "There is no comparison between them." },
  { text: "competition", meaning: "\u7ADE\u4E89", example: "The competition was very hard." },
  { text: "concern", meaning: "\u5173\u5FC3", example: "That is my main concern right now." },
  { text: "condition", meaning: "\u6761\u4EF6", example: "The condition of the house is good." },
  { text: "connection", meaning: "\u8054\u7CFB", example: "There is a connection between the two." },
  { text: "consideration", meaning: "\u8003\u8651", example: "Give this careful consideration." },
  { text: "construction", meaning: "\u5EFA\u8BBE", example: "The construction of the road is done." },
  { text: "contact", meaning: "\u8054\u7CFB", example: "Keep in contact with your friends." },
  { text: "contract", meaning: "\u5408\u540C", example: "Sign the contract before you start." },
  { text: "conversation", meaning: "\u5BF9\u8BDD", example: "We had a nice conversation." },
  { text: "corner", meaning: "\u89D2\u843D", example: "Turn at the corner of the street." },
  { text: "courage", meaning: "\u52C7\u6C14", example: "You need courage to do this." },
  { text: "creation", meaning: "\u521B\u9020", example: "This is a work of great creation." },
  { text: "crisis", meaning: "\u5371\u673A", example: "We must act in this crisis now." },
  { text: "criticism", meaning: "\u6279\u8BC4", example: "The criticism was not very kind." },
  { text: "custom", meaning: "\u4E60\u4FD7", example: "This custom is very old here." },
  { text: "date", meaning: "\u65E5\u671F", example: "What is the date of the meeting?" },
  { text: "deal", meaning: "\u4EA4\u6613", example: "That is a good deal for both of us." },
  { text: "debate", meaning: "\u8FA9\u8BBA", example: "The debate lasted two hours." },
  { text: "debt", meaning: "\u503A\u52A1", example: "He has a large debt to pay off." },
  { text: "decision", meaning: "\u51B3\u5B9A", example: "Make your decision before Friday." },
  { text: "defeat", meaning: "\u5931\u8D25", example: "The defeat was a hard one to take." },
  { text: "defense", meaning: "\u9632\u5FA1", example: "The defense of the city was strong." },
  { text: "degree", meaning: "\u7A0B\u5EA6", example: "A high degree of skill is needed." },
  { text: "demand", meaning: "\u9700\u6C42", example: "The demand for this product is high." },
  { text: "description", meaning: "\u63CF\u8FF0", example: "Give me a clear description of him." },
  { text: "direction", meaning: "\u65B9\u5411", example: "In which direction should we go?" },
  { text: "discovery", meaning: "\u53D1\u73B0", example: "The discovery was made last year." },
  { text: "discussion", meaning: "\u8BA8\u8BBA", example: "We had a good discussion about it." },
  { text: "distance", meaning: "\u8DDD\u79BB", example: "The distance is about two miles." },
  { text: "disturbance", meaning: "\u6253\u6270", example: "Sorry for the disturbance today." },
  { text: "doubt", meaning: "\u6000\u7591", example: "There is no doubt about this." },
  { text: "dream", meaning: "\u68A6", example: "I had a strange dream last night." },
  { text: "duty", meaning: "\u8D23\u4EFB", example: "It is my duty to help you." },
  { text: "earth", meaning: "\u5730\u7403", example: "The earth goes around the sun." },
  { text: "edge", meaning: "\u8FB9\u7F18", example: "Be careful at the edge of the cliff." },
  { text: "education", meaning: "\u6559\u80B2", example: "Education is important for all." },
  { text: "effort", meaning: "\u52AA\u529B", example: "It took a lot of effort to finish." },
  { text: "emotion", meaning: "\u60C5\u611F", example: "Love is a strong emotion in life." },
  { text: "energy", meaning: "\u7CBE\u529B", example: "She has a lot of energy today." },
  { text: "example", meaning: "\u4F8B\u5B50", example: "Give me an example of your work." },
  { text: "exchange", meaning: "\u4EA4\u6362", example: "We made an exchange of ideas." },
  { text: "excitement", meaning: "\u5174\u594B", example: "The excitement of the game was great." },
  { text: "experience", meaning: "\u7ECF\u9A8C", example: "He has much experience in this field." },
  { text: "expression", meaning: "\u8868\u8FBE", example: "His expression was very kind." },
  { text: "failure", meaning: "\u5931\u8D25", example: "Failure is a part of life." },
  { text: "faith", meaning: "\u4FE1\u5FF5", example: "I have faith in your ability." },
  { text: "fame", meaning: "\u540D\u58F0", example: "He gained fame for his work." },
  { text: "favor", meaning: "\u5E2E\u52A9", example: "Can you do me a favor now?" },
  { text: "feeling", meaning: "\u611F\u89C9", example: "I have a good feeling about this." },
  { text: "figure", meaning: "\u6570\u5B57", example: "What are the figures for this year?" },
  { text: "force", meaning: "\u529B\u91CF", example: "Use force to open the door." },
  { text: "form", meaning: "\u5F62\u5F0F", example: "Fill out this form before you go." },
  { text: "freedom", meaning: "\u81EA\u7531", example: "Freedom is important to every person." },
  { text: "future", meaning: "\u672A\u6765", example: "The future looks very bright for us." },
  { text: "gain", meaning: "\u83B7\u5F97", example: "You will gain much from this work." },
  { text: "goal", meaning: "\u76EE\u6807", example: "What is your main goal in life?" },
  { text: "grace", meaning: "\u4F18\u96C5", example: "She moves with great grace and poise." },
  { text: "growth", meaning: "\u589E\u957F", example: "The growth of the company is fast." },
  { text: "guide", meaning: "\u6307\u5357", example: "This book is a good guide for all." },
  { text: "habit", meaning: "\u4E60\u60EF", example: "It is a good habit to read every day." },
  { text: "harm", meaning: "\u4F24\u5BB3", example: "There is no harm in trying this." },
  { text: "harvest", meaning: "\u6536\u83B7", example: "The harvest was very good this year." },
  { text: "health", meaning: "\u5065\u5EB7", example: "Good health is important for life." },
  { text: "heat", meaning: "\u70ED", example: "The heat of the sun is very strong." },
  { text: "help", meaning: "\u5E2E\u52A9", example: "Can you give me some help today?" },
  { text: "history", meaning: "\u5386\u53F2", example: "We study history at school." },
  { text: "hope", meaning: "\u5E0C\u671B", example: "I have hope for a better future." },
  { text: "humor", meaning: "\u5E7D\u9ED8", example: "He has a great sense of humor." },
  { text: "hurry", meaning: "\u5306\u5FD9", example: "Why are you in such a hurry today?" },
  { text: "idea", meaning: "\u60F3\u6CD5", example: "That is a very good idea indeed." },
  { text: "imagination", meaning: "\u60F3\u8C61\u529B", example: "She has a great imagination." },
  { text: "importance", meaning: "\u91CD\u8981\u6027", example: "The importance of this is great." },
  { text: "impression", meaning: "\u5370\u8C61", example: "You made a good impression on me." },
  { text: "independence", meaning: "\u72EC\u7ACB", example: "She values her independence greatly." },
  { text: "influence", meaning: "\u5F71\u54CD", example: "He has a strong influence on others." },
  { text: "interest", meaning: "\u5174\u8DA3", example: "I have a great interest in music." },
  { text: "intention", meaning: "\u610F\u56FE", example: "My intention is to help you all." },
  { text: "iron", meaning: "\u94C1", example: "The gate is made of iron metal." },
  { text: "joy", meaning: "\u6B22\u4E50", example: "The birth of the baby brought joy." },
  { text: "judgment", meaning: "\u5224\u65AD", example: "Use good judgment in this matter." },
  { text: "justice", meaning: "\u6B63\u4E49", example: "Justice must be done for all people." },
  { text: "knowledge", meaning: "\u77E5\u8BC6", example: "His knowledge of this subject is great." },
  { text: "lack", meaning: "\u7F3A\u4E4F", example: "There is a lack of clean water here." },
  { text: "law", meaning: "\u6CD5\u5F8B", example: "Every person must follow the law." },
  { text: "leadership", meaning: "\u9886\u5BFC\u529B", example: "She has great leadership ability." },
  { text: "league", meaning: "\u8054\u76DF", example: "They joined the same league together." },
  { text: "length", meaning: "\u957F\u5EA6", example: "The length of the road is five miles." },
  { text: "lesson", meaning: "\u8BFE", example: "We learned a good lesson today." },
  { text: "liberty", meaning: "\u81EA\u7531", example: "Liberty is important to all people." },
  { text: "life", meaning: "\u751F\u547D", example: "Life is full of good surprises." },
  { text: "limit", meaning: "\u9650\u5236", example: "There is a limit to what we can do." },
  { text: "line", meaning: "\u7EBF", example: "Draw a straight line on the paper." },
  { text: "loss", meaning: "\u635F\u5931", example: "The loss of the game was very sad." },
  { text: "love", meaning: "\u7231", example: "Love is the strongest emotion." },
  { text: "luck", meaning: "\u8FD0\u6C14", example: "Good luck with your new job." },
  { text: "mark", meaning: "\u8BB0\u53F7", example: "Put a mark on the right answer." },
  { text: "mass", meaning: "\u5927\u91CF", example: "There was a mass of people at the gate." },
  { text: "measure", meaning: "\u6D4B\u91CF", example: "Measure the room before you buy." },
  { text: "memory", meaning: "\u8BB0\u5FC6", example: "I have a good memory of that day." },
  { text: "message", meaning: "\u4FE1\u606F", example: "Leave a message for me here." },
  { text: "method", meaning: "\u65B9\u6CD5", example: "This method works very well for me." },
  { text: "mind", meaning: "\u5934\u8111", example: "A good mind is a terrible thing to waste." },
  { text: "moment", meaning: "\u65F6\u523B", example: "Wait just a moment for me please." },
  { text: "money", meaning: "\u94B1", example: "How much money do you have now?" },
  { text: "motion", meaning: "\u8FD0\u52A8", example: "The motion of the car was very smooth." },
  { text: "music", meaning: "\u97F3\u4E50", example: "I like to listen to good music." },
  { text: "mystery", meaning: "\u8C1C", example: "The mystery was solved at last." },
  { text: "nature", meaning: "\u81EA\u7136", example: "I love the beauty of nature." },
  { text: "need", meaning: "\u9700\u8981", example: "There is no need to hurry now." },
  { text: "nerve", meaning: "\u795E\u7ECF", example: "You need a lot of nerve to do this." },
  { text: "note", meaning: "\u7B14\u8BB0", example: "Write a note to remind me." },
  { text: "notice", meaning: "\u6CE8\u610F", example: "Did you notice the sign on the door?" },
  { text: "number", meaning: "\u6570\u5B57", example: "Give me the number for the taxi." },
  { text: "object", meaning: "\u7269\u4F53", example: "What is that object on the table?" },
  { text: "obligation", meaning: "\u4E49\u52A1", example: "It is my obligation to help others." },
  { text: "observation", meaning: "\u89C2\u5BDF", example: "Your observation is very important." },
  { text: "occasion", meaning: "\u573A\u5408", example: "This is a very special occasion for us." },
  { text: "offer", meaning: "\u63D0\u8BAE", example: "That is a good offer for the house." },
  { text: "order", meaning: "\u79E9\u5E8F", example: "Everything is in good order now." },
  { text: "pain", meaning: "\u75BC\u75DB", example: "I felt a sharp pain in my head." },
  { text: "pair", meaning: "\u4E00\u5BF9", example: "I need a new pair of shoes." },
  { text: "passage", meaning: "\u901A\u9053", example: "The passage between the rooms is short." },
  { text: "patience", meaning: "\u8010\u5FC3", example: "You need patience to teach a child." },
  { text: "pattern", meaning: "\u6A21\u5F0F", example: "I like the pattern on this cloth." },
  { text: "peace", meaning: "\u548C\u5E73", example: "We all want peace in the world." },
  { text: "percent", meaning: "\u767E\u5206\u6BD4", example: "Fifty percent of the people came." },
  { text: "performance", meaning: "\u8868\u73B0", example: "Your performance was very good." },
  { text: "period", meaning: "\u65F6\u671F", example: "This was a good period in our life." },
  { text: "permission", meaning: "\u5141\u8BB8", example: "Do I have permission to go now?" },
  { text: "pleasure", meaning: "\u5FEB\u4E50", example: "It was a pleasure to meet you." },
  { text: "plenty", meaning: "\u5927\u91CF", example: "We have plenty of time to finish." },
  { text: "point", meaning: "\u70B9", example: "What is the main point of this story?" },
  { text: "position", meaning: "\u4F4D\u7F6E", example: "What is your position on this matter?" },
  { text: "possibility", meaning: "\u53EF\u80FD\u6027", example: "There is a possibility of rain today." },
  { text: "power", meaning: "\u529B\u91CF", example: "Knowledge is a form of power." },
  { text: "practice", meaning: "\u7EC3\u4E60", example: "Practice makes perfect in any skill." },
  { text: "praise", meaning: "\u8D5E\u626C", example: "He received much praise for his work." },
  { text: "prayer", meaning: "\u7948\u7977", example: "She said a prayer before the meal." },
  { text: "pride", meaning: "\u9A84\u50B2", example: "She takes great pride in her work." },
  { text: "principle", meaning: "\u539F\u5219", example: "He always acts on principle." },
  { text: "promise", meaning: "\u627F\u8BFA", example: "I give you my promise to be kind." },
  { text: "property", meaning: "\u8D22\u4EA7", example: "This property belongs to our family." },
  { text: "proposal", meaning: "\u5EFA\u8BAE", example: "The proposal was accepted by all." },
  { text: "protection", meaning: "\u4FDD\u62A4", example: "This coat gives you protection from rain." },
  { text: "purpose", meaning: "\u76EE\u7684", example: "What is the purpose of this meeting?" },
  { text: "quality", meaning: "\u8D28\u91CF", example: "The quality of this product is very good." },
  { text: "quantity", meaning: "\u6570\u91CF", example: "What quantity do you need to buy?" },
  { text: "range", meaning: "\u8303\u56F4", example: "The range of choices is very wide." },
  { text: "rate", meaning: "\u6BD4\u7387", example: "What is the rate of growth here?" },
  { text: "reaction", meaning: "\u53CD\u5E94", example: "What was your reaction to the news?" },
  { text: "reason", meaning: "\u539F\u56E0", example: "Give me a good reason for this." },
  { text: "reference", meaning: "\u53C2\u8003", example: "Use this book as your reference." },
  { text: "relation", meaning: "\u5173\u7CFB", example: "We have a good relation with them." },
  { text: "remains", meaning: "\u6B8B\u4F59", example: "The remains of the old house were sad." },
  { text: "respect", meaning: "\u5C0A\u91CD", example: "Show respect to the older people." },
  { text: "result", meaning: "\u7ED3\u679C", example: "The result was better than expected." },
  { text: "reward", meaning: "\u5956\u52B1", example: "He got a reward for good work." },
  { text: "role", meaning: "\u89D2\u8272", example: "She played a big role in this project." },
  { text: "rule", meaning: "\u89C4\u5219", example: "Every person must follow the rule." },
  { text: "safety", meaning: "\u5B89\u5168", example: "Safety is the most important thing." },
  { text: "satisfaction", meaning: "\u6EE1\u610F", example: "He looked at his work with satisfaction." },
  { text: "scale", meaning: "\u89C4\u6A21", example: "The scale of the project is very big." },
  { text: "section", meaning: "\u90E8\u5206", example: "This section of the book is interesting." },
  { text: "selection", meaning: "\u9009\u62E9", example: "The selection of candidates was good." },
  { text: "service", meaning: "\u670D\u52A1", example: "The service at this hotel is great." },
  { text: "share", meaning: "\u4EFD\u989D", example: "What is my share of the total cost?" },
  { text: "sign", meaning: "\u8FF9\u8C61", example: "There is no sign of the storm yet." },
  { text: "silence", meaning: "\u6C89\u9ED8", example: "The silence in the room was deep." },
  { text: "skill", meaning: "\u6280\u80FD", example: "She has a great skill in painting." },
  { text: "sleep", meaning: "\u7761\u7720", example: "I need eight hours of sleep each night." },
  { text: "society", meaning: "\u793E\u4F1A", example: "We all live in the same society." },
  { text: "solution", meaning: "\u89E3\u51B3", example: "We found a good solution to the problem." },
  { text: "soul", meaning: "\u7075\u9B42", example: "Music touches the soul of a person." },
  { text: "spirit", meaning: "\u7CBE\u795E", example: "He has a good spirit in life." },
  { text: "strength", meaning: "\u529B\u91CF", example: "She has the strength to carry on." },
  { text: "struggle", meaning: "\u594B\u6597", example: "The struggle for peace goes on." },
  { text: "success", meaning: "\u6210\u529F", example: "Success comes to those who work hard." },
  { text: "suffering", meaning: "\u75DB\u82E6", example: "The suffering of the people was great." },
  { text: "symbol", meaning: "\u8C61\u5F81", example: "The dove is a symbol of peace." },
  { text: "talent", meaning: "\u624D\u80FD", example: "She has a great talent for music." },
  { text: "taste", meaning: "\u54C1\u5473", example: "He has very good taste in art." },
  { text: "tendency", meaning: "\u8D8B\u52BF", example: "There is a tendency for prices to rise." },
  { text: "thought", meaning: "\u60F3\u6CD5", example: "That was a good thought from you." },
  { text: "tide", meaning: "\u6F6E\u6C34", example: "The tide comes in twice a day." },
  { text: "time", meaning: "\u65F6\u95F4", example: "Time is very precious for all of us." },
  { text: "title", meaning: "\u6807\u9898", example: "What is the title of this book?" },
  { text: "tone", meaning: "\u8BED\u6C14", example: "He spoke in a soft and kind tone." },
  { text: "trade", meaning: "\u8D38\u6613", example: "Trade between the two countries is good." },
  { text: "tradition", meaning: "\u4F20\u7EDF", example: "This tradition is very old here." },
  { text: "treatment", meaning: "\u5BF9\u5F85", example: "He received good treatment at the hospital." },
  { text: "trend", meaning: "\u8D8B\u52BF", example: "There is a new trend in fashion." },
  { text: "trust", meaning: "\u4FE1\u4EFB", example: "I have trust in my good friends." },
  { text: "turn", meaning: "\u8F6C\u5F2F", example: "Take a right turn at the corner." },
  { text: "union", meaning: "\u8054\u5408", example: "The union of the two groups was good." },
  { text: "value", meaning: "\u4EF7\u503C", example: "The value of this painting is high." },
  { text: "variety", meaning: "\u591A\u6837\u6027", example: "A variety of food is on the table." },
  { text: "victory", meaning: "\u80DC\u5229", example: "The victory was celebrated by all." },
  { text: "violence", meaning: "\u66B4\u529B", example: "We must stop all forms of violence." },
  { text: "volume", meaning: "\u97F3\u91CF", example: "Turn the volume up on the radio." },
  { text: "wage", meaning: "\u5DE5\u8D44", example: "What is the hourly wage for this job?" },
  { text: "war", meaning: "\u6218\u4E89", example: "War brings much suffering to people." },
  { text: "warning", meaning: "\u8B66\u544A", example: "The warning came just in time for us." },
  { text: "wealth", meaning: "\u8D22\u5BCC", example: "True wealth is having good health." },
  { text: "weapon", meaning: "\u6B66\u5668", example: "The weapon was found by the army." },
  { text: "weight", meaning: "\u91CD\u91CF", example: "What is the weight of this bag?" },
  { text: "welcome", meaning: "\u6B22\u8FCE", example: "You are welcome in our home always." },
  { text: "welfare", meaning: "\u798F\u5229", example: "The welfare of the people is important." },
  { text: "will", meaning: "\u610F\u5FD7", example: "She has a very strong will in life." },
  { text: "wish", meaning: "\u613F\u671B", example: "My wish is to travel the world." },
  { text: "wonder", meaning: "\u60CA\u5947", example: "I wonder what the future will bring." },
  { text: "work", meaning: "\u5DE5\u4F5C", example: "Hard work is the key to success." },
  { text: "world", meaning: "\u4E16\u754C", example: "The world is a beautiful place to live." },
  { text: "year", meaning: "\u5E74", example: "This has been a good year for us." },
  { text: "youth", meaning: "\u9752\u6625", example: "Youth is a time of great energy." },
  { text: "accord", meaning: "\u4E00\u81F4", example: "They came to an accord on the deal." },
  { text: "across", meaning: "\u7A7F\u8FC7", example: "He walked across the street safely." },
  { text: "address", meaning: "\u5730\u5740", example: "What is your home address?" },
  { text: "admit", meaning: "\u627F\u8BA4", example: "He did admit his mistake at last." },
  { text: "advance", meaning: "\u524D\u8FDB", example: "We must advance with the times." },
  { text: "against", meaning: "\u53CD\u5BF9", example: "They are against the new plan." },
  { text: "air", meaning: "\u7A7A\u6C14", example: "The air here is very clean and fresh." },
  { text: "anyone", meaning: "\u4EFB\u4F55\u4EBA", example: "Anyone can learn to read and write." },
  { text: "asleep", meaning: "\u7761\u7740", example: "The baby fell asleep quickly." },
  { text: "ate", meaning: "\u5403\u4E86", example: "She ate her breakfast at seven." },
  { text: "become", meaning: "\u6210\u4E3A", example: "She wants to become a doctor." },
  { text: "begin", meaning: "\u5F00\u59CB", example: "Let us begin the meeting now." },
  { text: "behave", meaning: "\u8868\u73B0", example: "Please behave well in the class." },
  { text: "belong", meaning: "\u5C5E\u4E8E", example: "This book belongs to my friend." },
  { text: "beside", meaning: "\u65C1\u8FB9", example: "Come and sit beside me here." },
  { text: "beyond", meaning: "\u8D85\u51FA", example: "The beauty is beyond all description." },
  { text: "bind", meaning: "\u7ED1", example: "Bind the books with a strong rope." },
  { text: "bite", meaning: "\u54AC", example: "The dog might bite if provoked." },
  { text: "block", meaning: "\u8857\u533A", example: "The store is two blocks from here." },
  { text: "boil", meaning: "\u6CB8\u817E", example: "Heat the water until it starts to boil." },
  { text: "borrow", meaning: "\u501F", example: "Can I borrow your pen for a minute?" },
  { text: "breed", meaning: "\u54C1\u79CD", example: "What breed of dog is this one?" },
  { text: "bring", meaning: "\u5E26\u6765", example: "Please bring your book to class." },
  { text: "brush", meaning: "\u5237", example: "Brush your teeth twice every day." },
  { text: "bucket", meaning: "\u6876", example: "Fill the bucket with clean water." },
  { text: "build", meaning: "\u5EFA\u9020", example: "They will build a new school here." },
  { text: "cage", meaning: "\u7B3C\u5B50", example: "The bird is inside the cage now." },
  { text: "calculate", meaning: "\u8BA1\u7B97", example: "Can you calculate the total cost?" },
  { text: "capture", meaning: "\u6355\u83B7", example: "The army managed to capture the town." },
  { text: "carry", meaning: "\u643A\u5E26", example: "Can you carry this bag for me?" },
  { text: "catch", meaning: "\u6293\u4F4F", example: "Try to catch the ball with both hands." },
  { text: "celebrate", meaning: "\u5E86\u795D", example: "We celebrate birthdays with a cake." },
  { text: "choose", meaning: "\u9009\u62E9", example: "Choose the one you like the most." },
  { text: "claim", meaning: "\u58F0\u79F0", example: "He did claim to know the answer." },
  { text: "climb", meaning: "\u6500\u767B", example: "We will climb the mountain tomorrow." },
  { text: "collect", meaning: "\u6536\u96C6", example: "She likes to collect old books." },
  { text: "combine", meaning: "\u7ED3\u5408", example: "Combine the two things into one." },
  { text: "commit", meaning: "\u627F\u8BFA", example: "He did commit to helping the team." },
  { text: "compare", meaning: "\u6BD4\u8F83", example: "Compare the two prices before buying." },
  { text: "connect", meaning: "\u8FDE\u63A5", example: "Connect the wire to the machine." },
  { text: "consider", meaning: "\u8003\u8651", example: "Please consider my offer carefully." },
  { text: "contain", meaning: "\u5305\u542B", example: "The box contains ten small items." },
  { text: "contribute", meaning: "\u8D21\u732E", example: "Everyone should contribute to the plan." },
  { text: "convince", meaning: "\u8BF4\u670D", example: "I tried to convince him to come." },
  { text: "count", meaning: "\u8BA1\u6570", example: "Count the money and tell me the total." },
  { text: "crash", meaning: "\u78B0\u649E", example: "The car crashed into a big tree." },
  { text: "create", meaning: "\u521B\u9020", example: "She can create beautiful things from art." },
  { text: "cut", meaning: "\u5207", example: "Cut the bread into small pieces." },
  { text: "dance", meaning: "\u8DF3\u821E", example: "They like to dance to the music." },
  { text: "decide", meaning: "\u51B3\u5B9A", example: "Decide what you want to do first." },
  { text: "deliver", meaning: "\u9012\u9001", example: "They will deliver the package today." },
  { text: "describe", meaning: "\u63CF\u8FF0", example: "Can you describe what you saw?" },
  { text: "deserve", meaning: "\u503C\u5F97", example: "She does deserve this good reward." },
  { text: "destroy", meaning: "\u6BC1\u574F", example: "The storm could destroy many buildings." },
  { text: "develop", meaning: "\u53D1\u5C55", example: "We must develop new ideas and plans." },
  { text: "die", meaning: "\u6B7B\u4EA1", example: "Plants will die without water and light." },
  { text: "dig", meaning: "\u6316", example: "Dig a deep hole in the ground here." },
  { text: "divide", meaning: "\u5206\u5F00", example: "Divide the food equally among all." },
  { text: "draw", meaning: "\u753B", example: "She can draw very well with a pen." },
  { text: "earn", meaning: "\u8D5A", example: "She works hard to earn good money." },
  { text: "educate", meaning: "\u6559\u80B2", example: "We must educate all the young children." },
  { text: "elect", meaning: "\u9009\u4E3E", example: "They will elect a new leader soon." },
  { text: "employ", meaning: "\u96C7\u7528", example: "The company will employ many new people." },
  { text: "encourage", meaning: "\u9F13\u52B1", example: "We must encourage the children to learn." },
  { text: "enjoy", meaning: "\u4EAB\u53D7", example: "I enjoy spending time with my family." },
  { text: "enter", meaning: "\u8FDB\u5165", example: "Please enter the room quietly now." },
  { text: "escape", meaning: "\u9003\u8DD1", example: "The bird tried to escape from the cage." },
  { text: "examine", meaning: "\u68C0\u67E5", example: "The doctor will examine you tomorrow." },
  { text: "exercise", meaning: "\u953B\u70BC", example: "Take exercise every day to stay fit." },
  { text: "exist", meaning: "\u5B58\u5728", example: "Do you believe ghosts really exist?" },
  { text: "expect", meaning: "\u671F\u671B", example: "I expect to see you at the meeting." },
  { text: "explain", meaning: "\u89E3\u91CA", example: "Can you explain this to me again?" },
  { text: "explore", meaning: "\u63A2\u7D22", example: "They want to explore the deep ocean." },
  { text: "express", meaning: "\u8868\u8FBE", example: "How do you express your feelings?" },
  { text: "face", meaning: "\u9762\u5BF9", example: "We must face the truth together." },
  { text: "fight", meaning: "\u6218\u6597", example: "The two children fight over small things." },
  { text: "fill", meaning: "\u586B\u6EE1", example: "Please fill the glass with cold water." },
  { text: "find", meaning: "\u627E\u5230", example: "Try to find the lost key in the house." },
  { text: "float", meaning: "\u6F02\u6D6E", example: "Wood can float on top of the water." },
  { text: "flow", meaning: "\u6D41\u52A8", example: "The river flows from the mountain down." },
  { text: "fold", meaning: "\u6298\u53E0", example: "Fold the cloth and put it in the box." },
  { text: "follow", meaning: "\u8DDF\u968F", example: "Follow me and I will show the way." },
  { text: "freeze", meaning: "\u7ED3\u51B0", example: "Water will freeze when it gets cold." },
  { text: "hang", meaning: "\u6302", example: "Hang your coat on the hook by the door." },
  { text: "happen", meaning: "\u53D1\u751F", example: "What happened at school today?" },
  { text: "hate", meaning: "\u8BA8\u538C", example: "I hate getting up early in the morning." },
  { text: "hear", meaning: "\u542C\u5230", example: "Can you hear the sound of the music?" },
  { text: "hide", meaning: "\u8EB2\u85CF", example: "The children like to hide behind the door." },
  { text: "hunt", meaning: "\u6253\u730E", example: "The cat will hunt for a small mouse." },
  { text: "hurt", meaning: "\u53D7\u4F24", example: "Be careful or you will hurt yourself." },
  { text: "imagine", meaning: "\u60F3\u8C61", example: "Imagine you are in a beautiful garden." },
  { text: "include", meaning: "\u5305\u62EC", example: "The price does include the tax here." },
  { text: "increase", meaning: "\u589E\u52A0", example: "We must increase our daily effort." },
  { text: "inform", meaning: "\u901A\u77E5", example: "Please inform me of any changes." },
  { text: "insist", meaning: "\u575A\u6301", example: "He did insist on paying for dinner." },
  { text: "invite", meaning: "\u9080\u8BF7", example: "We will invite all our friends to come." },
  { text: "join", meaning: "\u52A0\u5165", example: "Do you want to join our team today?" },
  { text: "kick", meaning: "\u8E22", example: "The child kicked the ball very hard." },
  { text: "kill", meaning: "\u6740\u6B7B", example: "The cold can kill these small plants." },
  { text: "kiss", meaning: "\u4EB2\u543B", example: "She gave the baby a soft kiss." },
  { text: "kneel", meaning: "\u8DEA", example: "He had to kneel down to fix the shoe." },
  { text: "knock", meaning: "\u6572", example: "Knock on the door before you enter." },
  { text: "lay", meaning: "\u653E", example: "Lay the book on the table, please." },
  { text: "lead", meaning: "\u9886\u5BFC", example: "She was chosen to lead the group." },
  { text: "lift", meaning: "\u4E3E\u8D77", example: "Lift the heavy box with care." },
  { text: "link", meaning: "\u8FDE\u63A5", example: "There is a strong link between the two." },
  { text: "listen", meaning: "\u542C", example: "Listen carefully to what I say." },
  { text: "load", meaning: "\u88C5\u8F7D", example: "Load the bags onto the truck now." },
  { text: "manage", meaning: "\u8BBE\u6CD5", example: "She can manage all the work by herself." },
  { text: "march", meaning: "\u884C\u519B", example: "The army will march at dawn tomorrow." },
  { text: "mix", meaning: "\u6DF7\u5408", example: "Mix the flour with some cold water." },
  { text: "murder", meaning: "\u8C0B\u6740", example: "The police investigated the murder case." },
  { text: "nod", meaning: "\u70B9\u5934", example: "She did nod her head in agreement." },
  { text: "obey", meaning: "\u670D\u4ECE", example: "Children must obey the safety rules." },
  { text: "obtain", meaning: "\u83B7\u5F97", example: "You can obtain this book at the store." },
  { text: "occur", meaning: "\u53D1\u751F", example: "Accidents can occur without warning." },
  { text: "operate", meaning: "\u64CD\u4F5C", example: "Can you operate this machine for me?" },
  { text: "oppose", meaning: "\u53CD\u5BF9", example: "They did oppose the new law strongly." },
  { text: "owe", meaning: "\u6B20", example: "I do owe you a great deal of money." },
  { text: "pass", meaning: "\u7ECF\u8FC7", example: "We will pass through the old town." },
  { text: "perform", meaning: "\u8868\u6F14", example: "She will perform on the stage tonight." },
  { text: "permit", meaning: "\u5141\u8BB8", example: "They will not permit smoking inside." },
  { text: "persuade", meaning: "\u8BF4\u670D", example: "Try to persuade him to come with us." },
  { text: "pick", meaning: "\u6311\u9009", example: "Pick the best one from all the items." },
  { text: "plan", meaning: "\u8BA1\u5212", example: "We need a good plan for the project." },
  { text: "plant", meaning: "\u79CD\u690D", example: "We will plant new trees in the spring." },
  { text: "pour", meaning: "\u5012", example: "Pour some milk into the big cup." },
  { text: "pray", meaning: "\u7948\u7977", example: "We all pray for peace in the world." },
  { text: "prefer", meaning: "\u504F\u597D", example: "I prefer tea to coffee in the morning." },
  { text: "prepare", meaning: "\u51C6\u5907", example: "Prepare the room for the meeting." },
  { text: "produce", meaning: "\u751F\u4EA7", example: "They produce good work at this factory." },
  { text: "protect", meaning: "\u4FDD\u62A4", example: "We must protect the small children." },
  { text: "prove", meaning: "\u8BC1\u660E", example: "Can you prove this is true for us?" },
  { text: "provide", meaning: "\u63D0\u4F9B", example: "They will provide food for everyone." },
  { text: "publish", meaning: "\u51FA\u7248", example: "They will publish the new book soon." },
  { text: "pull", meaning: "\u62C9", example: "Pull the door hard to open it now." },
  { text: "pump", meaning: "\u6CF5", example: "Use the pump to get water from the well." },
  { text: "push", meaning: "\u63A8", example: "Push the door to open it from the inside." },
  { text: "raise", meaning: "\u4E3E\u8D77", example: "Raise your hand if you know the answer." },
  { text: "reach", meaning: "\u5230\u8FBE", example: "We will reach the city by evening time." },
  { text: "receive", meaning: "\u6536\u5230", example: "I did receive your letter yesterday." },
  { text: "reduce", meaning: "\u51CF\u5C11", example: "We must reduce the cost of this project." },
  { text: "reflect", meaning: "\u53CD\u5C04", example: "The mirror will reflect your face clearly." },
  { text: "refuse", meaning: "\u62D2\u7EDD", example: "He did refuse to answer the question." },
  { text: "remain", meaning: "\u4FDD\u6301", example: "Please remain calm in this situation." },
  { text: "remove", meaning: "\u79FB\u9664", example: "Remove the old cover from the table." },
  { text: "replace", meaning: "\u66FF\u6362", example: "We need to replace the broken window." },
  { text: "require", meaning: "\u9700\u8981", example: "This job will require much hard work." },
  { text: "resist", meaning: "\u62B5\u6297", example: "She did resist the temptation to eat more." },
  { text: "respond", meaning: "\u56DE\u7B54", example: "Please respond to my question now." },
  { text: "rise", meaning: "\u4E0A\u5347", example: "The sun will rise early tomorrow morning." },
  { text: "roll", meaning: "\u6EDA\u52A8", example: "The ball will roll down the big hill." },
  { text: "satisfy", meaning: "\u6EE1\u8DB3", example: "This result will satisfy most of the people." },
  { text: "search", meaning: "\u641C\u7D22", example: "They will search for the lost item all day." },
  { text: "select", meaning: "\u6311\u9009", example: "Select the best one from all the choices." },
  { text: "separate", meaning: "\u5206\u5F00", example: "Separate the good fruit from the bad." },
  { text: "serve", meaning: "\u670D\u52A1", example: "They serve good food at this restaurant." },
  { text: "settle", meaning: "\u5B9A\u5C45", example: "They want to settle in a quiet small town." },
  { text: "shake", meaning: "\u6447", example: "Shake the bottle well before you drink." },
  { text: "shoot", meaning: "\u5C04\u51FB", example: "The hunter will shoot at the target now." },
  { text: "sink", meaning: "\u4E0B\u6C89", example: "Heavy things will sink in deep water." },
  { text: "sit", meaning: "\u5750", example: "Come and sit down here with me now." },
  { text: "slide", meaning: "\u6ED1\u52A8", example: "The book will slide off the edge of the table." },
  { text: "sort", meaning: "\u5206\u7C7B", example: "Sort these things into two main piles." },
  { text: "speak", meaning: "\u8BF4\u8BDD", example: "Speak clearly so everyone can hear you." },
  { text: "spread", meaning: "\u5C55\u5F00", example: "Spread the map out on the table here." },
  { text: "stand", meaning: "\u7AD9\u7ACB", example: "Please stand up and face the front now." },
  { text: "start", meaning: "\u5F00\u59CB", example: "When does the meeting start today?" },
  { text: "steal", meaning: "\u5077", example: "It is wrong to steal from other people." },
  { text: "stick", meaning: "\u7C98", example: "Stick the paper onto the wall with glue." },
  { text: "stop", meaning: "\u505C\u6B62", example: "Stop talking and listen to the teacher." },
  { text: "stretch", meaning: "\u4F38\u5C55", example: "Stretch your arms out wide before exercise." },
  { text: "strike", meaning: "\u6253\u51FB", example: "The clock will strike twelve at noon." },
  { text: "study", meaning: "\u5B66\u4E60", example: "Study hard and you will pass the test." },
  { text: "succeed", meaning: "\u6210\u529F", example: "If you work hard you will succeed in life." },
  { text: "supply", meaning: "\u4F9B\u5E94", example: "They will supply food for the big event." },
  { text: "support", meaning: "\u652F\u6301", example: "We will support you in this difficult time." },
  { text: "suppose", meaning: "\u5047\u8BBE", example: "I suppose you are right about this matter." },
  { text: "surprise", meaning: "\u60CA\u559C", example: "The party was a big surprise for her." },
  { text: "surround", meaning: "\u5305\u56F4", example: "Mountains surround the small quiet village." },
  { text: "survive", meaning: "\u751F\u5B58", example: "Only a few plants can survive the cold." },
  { text: "suspect", meaning: "\u6000\u7591", example: "I suspect he knows the real answer." },
  { text: "swallow", meaning: "\u541E", example: "Swallow the medicine with some water." },
  { text: "sweep", meaning: "\u6253\u626B", example: "Sweep the floor before the guests arrive." },
  { text: "swim", meaning: "\u6E38\u6CF3", example: "The children love to swim in the lake." },
  { text: "swing", meaning: "\u6447\u6446", example: "The sign will swing in the strong wind." },
  { text: "teach", meaning: "\u6559", example: "She did teach us many good things." },
  { text: "tear", meaning: "\u6495", example: "Be careful not to tear the paper there." },
  { text: "throw", meaning: "\u6254", example: "Throw the ball to me when I am ready." },
  { text: "tidy", meaning: "\u6574\u7406", example: "Tidy up your room before you go out." },
  { text: "tip", meaning: "\u5C16\u7AEF", example: "Be careful at the tip of the sharp knife." },
  { text: "toss", meaning: "\u629B", example: "Toss the coin and see which side comes up." },
  { text: "touch", meaning: "\u89E6\u6478", example: "Do not touch the hot surface with bare hands." },
  { text: "trace", meaning: "\u8FFD\u8E2A", example: "Try to trace the source of the problem." },
  { text: "translate", meaning: "\u7FFB\u8BD1", example: "Can you translate this into Chinese for me?" },
  { text: "travel", meaning: "\u65C5\u884C", example: "We will travel across the country by car." },
  { text: "treat", meaning: "\u5BF9\u5F85", example: "Treat other people the way you want." },
  { text: "trick", meaning: "\u8BE1\u8BA1", example: "That was just a trick to make us laugh." },
  { text: "try", meaning: "\u5C1D\u8BD5", example: "Try your best to finish the work on time." },
  { text: "twist", meaning: "\u626D", example: "Twist the lid hard to open the jar." },
  { text: "unite", meaning: "\u8054\u5408", example: "The two groups will unite for the cause." },
  { text: "urge", meaning: "\u50AC\u4FC3", example: "We urge you to make a decision now." },
  { text: "use", meaning: "\u4F7F\u7528", example: "Use your own judgment in this matter." },
  { text: "visit", meaning: "\u8BBF\u95EE", example: "We will visit our friends this weekend." },
  { text: "wait", meaning: "\u7B49\u5F85", example: "Please wait here until I come back." },
  { text: "warn", meaning: "\u8B66\u544A", example: "I must warn you about the dangers here." },
  { text: "wash", meaning: "\u6D17", example: "Wash your hands before you eat the food." },
  { text: "wave", meaning: "\u6325\u624B", example: "She will wave goodbye to her friend now." },
  { text: "wear", meaning: "\u7A7F", example: "Wear warm clothes in the cold weather." },
  { text: "weigh", meaning: "\u79F0\u91CD", example: "Weigh the fruit before you buy it here." },
  { text: "win", meaning: "\u8D62", example: "She will win the game if she plays well." }
];

// src/english/store.ts
var ENGLISH_FILE = "english-data.json";
var BASIC_ENGLISH_TOPIC = "Basic English 850";
async function loadEnglishState(storageDir) {
  const file = join3(storageDir, ENGLISH_FILE);
  try {
    const raw = await readFile2(file, "utf8");
    const parsed = JSON.parse(raw);
    const def = makeDefaultState();
    if (Array.isArray(parsed.cards)) def.cards = parsed.cards;
    if (typeof parsed.currentCardId === "string" || parsed.currentCardId === null) {
      def.currentCardId = parsed.currentCardId;
    }
    if (typeof parsed.xp === "number") def.xp = parsed.xp;
    if (typeof parsed.streak === "number") def.streak = parsed.streak;
    if (typeof parsed.lastActiveDate === "string" || parsed.lastActiveDate === null) {
      def.lastActiveDate = parsed.lastActiveDate;
    }
    if (typeof parsed.totalCompleted === "number") def.totalCompleted = parsed.totalCompleted;
    if (parsed.day && typeof parsed.day === "object") {
      const day = parsed.day;
      if (typeof day.hearts === "number") def.day.hearts = day.hearts;
      def.day.date = typeof day.date === "string" ? day.date : def.day.date;
    }
    if (parsed.statistics && typeof parsed.statistics === "object") {
      def.statistics = { ...def.statistics, ...parsed.statistics };
    }
    if (Array.isArray(parsed.wrongWords)) def.wrongWords = parsed.wrongWords;
    if (typeof parsed.frequency === "string") def.frequency = parsed.frequency;
    if (typeof parsed.dailyQuizLimit === "number") def.dailyQuizLimit = parsed.dailyQuizLimit;
    if (typeof parsed.quizzesToday === "number") def.quizzesToday = parsed.quizzesToday;
    if (typeof parsed.quizzesDate === "string") def.quizzesDate = parsed.quizzesDate;
    ensureBasicEnglish850(def);
    return def;
  } catch {
    const def = makeDefaultState();
    ensureBasicEnglish850(def);
    return def;
  }
}
function ensureBasicEnglish850(state) {
  const existing = state.cards.find((c) => c.topic === BASIC_ENGLISH_TOPIC);
  if (existing !== void 0) {
    existing.locked = true;
    return;
  }
  const card = makeCard(
    BASIC_ENGLISH_TOPIC,
    "copy",
    "count",
    3,
    BASIC_ENGLISH_850.map((w) => ({ text: w.text, meaning: w.meaning, example: w.example, type: "word", exampleMeaning: "" })),
    "en-simple"
  );
  card.locked = true;
  state.cards.unshift(card);
  if (state.currentCardId === null) state.currentCardId = card.id;
}
async function saveEnglishState(storageDir, state) {
  await mkdir2(storageDir, { recursive: true });
  const file = join3(storageDir, ENGLISH_FILE);
  await writeFile2(file, JSON.stringify(state), "utf8");
}

// src/english/routes.ts
var OK2 = (value) => JSON.stringify({ ok: true, ...value });
async function readJson(req, max) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > max) throw new Error("request body too large");
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  if (text.trim() === "") return void 0;
  return JSON.parse(text);
}
function createEnglishRoutes(options) {
  const load = options.load ?? loadEnglishState;
  const save = options.save ?? saveEnglishState;
  const dir = options.storageDir;
  const current = async () => load(dir);
  const base = "/bga-dsh-workbench/english";
  const sendJson = (res, body, status = 200) => {
    res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
    res.end(body);
  };
  const sendError = (res, message) => {
    sendJson(res, JSON.stringify({ ok: false, error: message }), 400);
  };
  return [
    // GET /state — full public snapshot (cards, progress, day, streak, xp).
    {
      kind: "exact",
      path: `${base}/state`,
      handler: async (_req, res) => {
        const state = await current();
        sendJson(res, OK2({ state: publicState(state) }));
      }
    },
    // POST /cards — adopt a built-in list OR save a generated card.
    // { builtin?: id }  -> create/overwrite a card from the built-in list.
    // { topic, mode, mastery, threshold, items } -> create/overwrite a card.
    {
      kind: "exact",
      path: `${base}/cards`,
      handler: async (req, res) => {
        try {
          const body = await readJson(req, 512 * 1024);
          const state = await current();
          let newCardId = null;
          if (body && typeof body.builtin === "string") {
            const list = findBuiltinList(body.builtin);
            if (list === void 0) throw new Error(`unknown builtin list: ${body.builtin}`);
            const mode = validMode(body.mode);
            const mastery = validMastery(body.mastery);
            const threshold = clampThreshold(body.threshold);
            const card = makeCard(list.label, mode, mastery, threshold, list.words.map((w) => ({ text: w.text, meaning: w.meaning, example: w.example })));
            const existing = state.cards.find((c) => c.topic === list.label);
            if (existing !== void 0) {
              const index = state.cards.indexOf(existing);
              state.cards[index] = card;
            } else {
              state.cards.push(card);
            }
            newCardId = card.id;
          } else if (body && typeof body.topic === "string" && Array.isArray(body.items)) {
            const topic = body.topic.trim();
            if (topic.length === 0) throw new Error("topic must not be empty");
            const mode = validMode(body.mode);
            const mastery = validMastery(body.mastery);
            const threshold = clampThreshold(body.threshold);
            const entries = body.items.map((item) => ({ text: String(item.text ?? ""), meaning: String(item.meaning ?? ""), example: String(item.example ?? "") })).filter((e) => e.text.trim() !== "");
            if (entries.length === 0) throw new Error("card must contain at least one item");
            const card = makeCard(topic, mode, mastery, threshold, entries);
            const existing = state.cards.find((c) => c.topic === topic);
            if (existing !== void 0) {
              const index = state.cards.indexOf(existing);
              state.cards[index] = card;
            } else {
              state.cards.push(card);
            }
            newCardId = card.id;
          } else {
            throw new Error("body must provide builtin (id) or topic + items");
          }
          if (newCardId !== null && state.currentCardId === null) state.currentCardId = newCardId;
          await save(dir, state);
          sendJson(res, OK2({ state: publicState(state) }));
        } catch (error) {
          sendError(res, error.message);
        }
      }
    },
    // POST /select — set the current learning card.
    { kind: "exact", path: `${base}/select`, handler: async (req, res) => {
      try {
        const body = await readJson(req, 16 * 1024);
        const cardId = typeof body?.cardId === "string" ? body.cardId : null;
        const state = await current();
        if (cardId !== null && !state.cards.some((c) => c.id === cardId)) {
          throw new Error("card not found");
        }
        state.currentCardId = cardId;
        await save(dir, state);
        sendJson(res, OK2({ state: publicState(state) }));
      } catch (error) {
        sendError(res, error.message);
      }
    } },
    // POST /cards/update — update mode/mastery/threshold on an existing card without resetting progress.
    { kind: "exact", path: `${base}/cards/update`, handler: async (req, res) => {
      try {
        const body = await readJson(req, 16 * 1024);
        const cardId = typeof body?.cardId === "string" ? body.cardId : "";
        if (cardId === "") throw new Error("cardId is required");
        const state = await current();
        const card = state.cards.find((c) => c.id === cardId);
        if (card === void 0) throw new Error("card not found");
        if (typeof body?.topic === "string" && body.topic.trim() !== "") card.topic = body.topic.trim();
        if (body?.mode !== void 0) card.mode = validMode(body.mode);
        if (body?.mastery !== void 0) card.mastery = validMastery(body.mastery);
        if (body?.threshold !== void 0) card.threshold = clampThreshold(body.threshold);
        if (body?.sessionSize !== void 0) card.sessionSize = clampSessionSize2(body.sessionSize);
        await save(dir, state);
        sendJson(res, OK2({ state: publicState(state) }));
      } catch (error) {
        sendError(res, error.message);
      }
    } },
    // POST /cards/delete — remove a topic card by id.
    { kind: "exact", path: `${base}/cards/delete`, handler: async (req, res) => {
      try {
        const body = await readJson(req, 16 * 1024);
        const cardId = typeof body?.cardId === "string" ? body.cardId : "";
        if (cardId === "") throw new Error("cardId is required");
        const state = await current();
        const index = state.cards.findIndex((c) => c.id === cardId);
        if (index === -1) throw new Error("card not found");
        if (state.cards[index].locked) throw new Error("\u8BE5\u4E3B\u9898\u5361\u5DF2\u9501\u5B9A\uFF0C\u65E0\u6CD5\u5220\u9664");
        state.cards.splice(index, 1);
        if (state.currentCardId === cardId) {
          state.currentCardId = state.cards.length > 0 ? state.cards[0].id : null;
        }
        await save(dir, state);
        sendJson(res, OK2({ state: publicState(state) }));
      } catch (error) {
        sendError(res, error.message);
      }
    } },
    // GET /models — available providers + models and the current default selection,
    // so the settings panel can offer a model picker when no default is configured.
    { kind: "exact", path: `${base}/models`, handler: async (_req, res) => {
      try {
        const providers = options.listModels === void 0 ? [] : await options.listModels();
        const current2 = options.currentSelection?.() ?? { provider: void 0, model: void 0 };
        sendJson(res, OK2({
          providers,
          current: { provider: current2.provider ?? null, model: current2.model ?? null },
          hasDefault: current2.provider !== void 0 && current2.model !== void 0
        }));
      } catch {
        sendJson(res, OK2({ providers: [], current: { provider: null, model: null }, hasDefault: false }));
      }
    } },
    // POST /default-model — persist the user's chosen default model { provider, model }.
    { kind: "exact", path: `${base}/default-model`, handler: async (req, res) => {
      try {
        const body = await readJson(req, 16 * 1024);
        const provider = typeof body?.provider === "string" ? body.provider : "";
        const model = typeof body?.model === "string" ? body.model : "";
        if (provider === "" || model === "") throw new Error("provider and model are required");
        if (options.saveSelection !== void 0) await options.saveSelection({ provider, model });
        sendJson(res, OK2({ provider, model }));
      } catch (error) {
        sendError(res, error.message);
      }
    } },
    // GET /next — a question from the current card (or null when locked/empty).
    { kind: "exact", path: `${base}/next`, handler: async (_req, res) => {
      const state = await current();
      const card = state.cards.find((c) => c.id === state.currentCardId);
      if (card === void 0) {
        sendJson(res, OK2({ question: null, reason: "no-card" }));
        return;
      }
      if (state.day.hearts <= 0) {
        sendJson(res, OK2({ question: null, reason: "locked" }));
        return;
      }
      const item = pickNextItem(card);
      if (item === null) {
        sendJson(res, OK2({ question: null, reason: "done" }));
        return;
      }
      sendJson(res, OK2({ question: buildQuestion(card, item), targetLang: card.targetLang ?? "en" }));
    } },
    // POST /result — grade an answer { itemId, cardId, answer, mode }.
    { kind: "exact", path: `${base}/result`, handler: async (req, res) => {
      try {
        const body = await readJson(req, 16 * 1024);
        const itemId = String(body?.itemId ?? "");
        const cardId = String(body?.cardId ?? "");
        const answer = String(body?.answer ?? "");
        const state = await current();
        const result = gradeAnswer(state, itemId, cardId, answer);
        await save(dir, state);
        sendJson(res, OK2({ result, state: publicState(state) }));
      } catch (error) {
        sendError(res, error.message);
      }
    } },
    // POST /builtins — return the built-in list catalogue (no storage side effects).
    { kind: "exact", path: `${base}/builtins`, handler: async (_req, res) => {
      const { BUILTIN_LISTS: BUILTIN_LISTS2 } = await Promise.resolve().then(() => (init_builtin(), builtin_exports));
      sendJson(res, OK2({ builtins: BUILTIN_LISTS2.map((l) => ({ id: l.id, label: l.label, level: l.level, count: l.words.length })) }));
    } },
    // GET /export — download the ledger as JSON.
    { kind: "exact", path: `${base}/export`, handler: async (_req, res) => {
      const state = await current();
      const text = exportState(state);
      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Content-Disposition": 'attachment; filename="english-data.json"' });
      res.end(text);
    } },
    // POST /import — replace the ledger from an uploaded document ({ content: <export string> }).
    { kind: "exact", path: `${base}/import`, handler: async (req, res) => {
      try {
        const body = await readJson(req, 8 * 1024 * 1024);
        const content = typeof body?.content === "string" ? body.content : void 0;
        const parsed = content === void 0 ? void 0 : parseImport(content);
        if (parsed === void 0) throw new Error("invalid english data document");
        await save(dir, parsed);
        sendJson(res, OK2({ state: publicState(parsed) }));
      } catch (error) {
        sendError(res, error.message);
      }
    } },
    // POST /generate — generate a topic card directly via the LLM service.
    // Depends on the host-provided generateText (ctx-bound llm.stream). Parses
    // the model's JSON reply, persists the card, and returns the fresh state so
    // the browser can refresh immediately.
    { kind: "exact", path: `${base}/generate`, handler: async (req, res) => {
      try {
        const body = await readJson(req, 64 * 1024);
        const topic = typeof body?.topic === "string" ? body.topic.trim() : "";
        if (topic.length === 0) throw new Error("topic must not be empty");
        if (options.generateText === void 0) throw new Error("\u5F53\u524D\u73AF\u5883\u4E0D\u652F\u6301\u76F4\u63A5\u751F\u6210\uFF0C\u8BF7\u6539\u7528\u5185\u7F6E\u8BCD\u5E93");
        const explicitProvider = typeof body?.provider === "string" ? body.provider : void 0;
        const explicitModel = typeof body?.model === "string" ? body.model : void 0;
        let provider = explicitProvider;
        let model = explicitModel;
        if ((provider === void 0 || model === void 0) && options.currentSelection !== void 0) {
          const current2 = options.currentSelection();
          provider = provider ?? current2.provider;
          model = model ?? current2.model;
        }
        const selection = provider !== void 0 && model !== void 0 ? { provider, model } : void 0;
        if (selection === void 0) {
          throw new Error("\u672A\u914D\u7F6E\u9ED8\u8BA4\u6A21\u578B\uFF0C\u8BF7\u5148\u5728\u4E0B\u65B9\u9009\u62E9\u6A21\u578B\u518D\u751F\u6210");
        }
        const rawText = await options.generateText(topic, selection, typeof body?.nativeLang === "string" ? body.nativeLang : void 0, typeof body?.targetLang === "string" ? body.targetLang : void 0);
        if (rawText === void 0) throw new Error("\u6A21\u578B\u751F\u6210\u5931\u8D25\uFF1A\u672A\u83B7\u53D6\u5230\u5185\u5BB9\uFF0C\u8BF7\u91CD\u8BD5\u6216\u66F4\u6362\u6A21\u578B");
        const parsed = extractJson(rawText);
        const arr = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.items) ? parsed.items : void 0;
        if (arr === void 0 || arr.length === 0) throw new Error("\u6A21\u578B\u8FD4\u56DE\u7684\u4E0D\u662F\u6709\u6548\u7684\u8BCD\u5E93 JSON");
        const mode = validMode(body?.mode);
        const mastery = validMastery(body?.mastery);
        const threshold = clampThreshold(body?.threshold);
        const entries = arr.map((item) => ({
          text: String(item.text ?? ""),
          meaning: String(item.meaning ?? ""),
          example: String(item.example ?? ""),
          exampleMeaning: String(item.exampleMeaning ?? ""),
          type: item.type === "sentence" ? "sentence" : "word"
        })).filter((e) => e.text.trim() !== "");
        if (entries.length === 0) throw new Error("\u6A21\u578B\u751F\u6210\u7ED3\u679C\u6CA1\u6709\u6709\u6548\u8BCD\u6761");
        const state = await current();
        const card = makeCard(topic, mode, mastery, threshold, entries);
        const existing = state.cards.find((c) => c.topic === topic);
        if (existing !== void 0) {
          const index = state.cards.indexOf(existing);
          state.cards[index] = card;
        } else {
          state.cards.push(card);
        }
        if (state.currentCardId === null) state.currentCardId = card.id;
        await save(dir, state);
        sendJson(res, OK2({ state: publicState(state) }));
      } catch (error) {
        sendError(res, error.message);
      }
    } },
    // POST /reset — wipe the ledger (idempotent).
    { kind: "exact", path: `${base}/reset`, handler: async (_req, res) => {
      const file = join4(dir, ENGLISH_FILE);
      await unlink2(file).catch(() => {
      });
      const fresh = makeDefaultState();
      ensureBasicEnglish850(fresh);
      await save(dir, fresh);
      sendJson(res, OK2({ state: publicState(fresh) }));
    } },
    // GET /wrong-words — return the wrong word notebook.
    { kind: "exact", path: `${base}/wrong-words`, handler: async (_req, res) => {
      const state = await current();
      sendJson(res, OK2({ wrongWords: state.wrongWords ?? [] }));
    } },
    // POST /wrong-words/clear — clear the wrong word notebook.
    { kind: "exact", path: `${base}/wrong-words/clear`, handler: async (_req, res) => {
      const state = await current();
      state.wrongWords = [];
      await save(dir, state);
      sendJson(res, OK2({ state: publicState(state) }));
    } },
    // POST /wrong-words/remove — remove a specific wrong word.
    { kind: "exact", path: `${base}/wrong-words/remove`, handler: async (req, res) => {
      try {
        const body = await readJson(req, 4096);
        if (!body?.itemId) return sendError(res, "itemId required");
        const state = await current();
        state.wrongWords = (state.wrongWords ?? []).filter((w) => w.itemId !== body.itemId);
        await save(dir, state);
        sendJson(res, OK2({ state: publicState(state) }));
      } catch {
        sendError(res, "invalid request");
      }
    } },
    // POST /frequency — update learning frequency settings.
    { kind: "exact", path: `${base}/frequency`, handler: async (req, res) => {
      try {
        const body = await readJson(req, 4096);
        const state = await current();
        if (body.frequency) state.frequency = body.frequency;
        if (typeof body.dailyQuizLimit === "number") state.dailyQuizLimit = Math.max(0, Math.min(50, body.dailyQuizLimit));
        await save(dir, state);
        sendJson(res, OK2({ state: publicState(state) }));
      } catch {
        sendError(res, "invalid request");
      }
    } },
    // GET /dashboard — return dashboard stats for the learning report.
    { kind: "exact", path: `${base}/dashboard`, handler: async (_req, res) => {
      const state = await current();
      const totalWrong = (state.wrongWords ?? []).length;
      const totalCards = state.cards.length;
      const masteredCards = state.cards.filter((c) => {
        const mastered = c.items.filter((i) => i.status === "mastered");
        return mastered.length === c.items.length && c.items.length > 0;
      }).length;
      sendJson(res, OK2({
        xp: state.xp,
        streak: state.streak,
        totalCompleted: state.totalCompleted,
        totalWrong,
        totalCards,
        masteredCards,
        statistics: state.statistics,
        day: state.day
      }));
    } }
  ];
}
function validMode(value) {
  return value === "recall" || value === "choice" || value === "audio" ? value : "copy";
}
function validMastery(value) {
  return value === "srs" ? "srs" : "count";
}
function clampThreshold(value) {
  const n = typeof value === "number" ? Math.floor(value) : 3;
  return Math.max(1, Math.min(20, n));
}
function clampSessionSize2(value) {
  const n = typeof value === "number" ? Math.round(value) : 5;
  return Math.max(1, Math.min(50, n));
}

// src/settings.ts
import { settingsNamespace } from "@deepseek-ai/dsh-settings";
var WORKBENCH_NAMESPACE = settingsNamespace("bga-dsh-workbench");
var WorkbenchSettingsSchema = Schema.object({
  banner: Schema.object({
    avatarPath: Schema.string(),
    text: Schema.string(),
    show: Schema.boolean()
  }),
  confetti: Schema.object({
    show: Schema.boolean(),
    sound: Schema.boolean(),
    theme: Schema.union([
      Schema.const("default"),
      Schema.const("gold"),
      Schema.const("ocean"),
      Schema.const("sakura"),
      Schema.const("neon")
    ]),
    intensity: Schema.union([
      Schema.const("small"),
      Schema.const("medium"),
      Schema.const("large"),
      Schema.const("epic")
    ]),
    trigger: Schema.union([
      Schema.const("success"),
      Schema.const("every"),
      Schema.const("task")
    ])
  }),
  english: Schema.object({
    enabled: Schema.boolean()
  }),
  open: Schema.object({
    terminal: Schema.string(),
    editor: Schema.string()
  }),
  openExtra: Schema.object({
    androidStudio: Schema.boolean(),
    xcode: Schema.boolean(),
    wechatDevtools: Schema.boolean(),
    intellijIdea: Schema.boolean(),
    devecoStudio: Schema.boolean(),
    webstorm: Schema.boolean(),
    pycharm: Schema.boolean(),
    goland: Schema.boolean()
  })
});
function registerWorkbenchSettings(ctx, base) {
  return ctx.settings.register(WORKBENCH_NAMESPACE, WorkbenchSettingsSchema, {
    base,
    applies: "live"
    // 实时生效：改完立即反映到运行时
  });
}

// src/task-board-host.ts
var SECTION_ORDER = 200;
var TASK_BOARD_GUIDANCE = "bga-dsh-workbench \u5185\u7F6E\u4EFB\u52A1\u770B\u677F\uFF08\u4FA7\u8FB9\u680F\u300C\u4EFB\u52A1\u770B\u677F\u300D\u5165\u53E3\uFF09\uFF1A\u591A\u5217\u770B\u677F\u7BA1\u7406\u4EFB\u52A1\uFF1B\u4EFB\u52A1\u53EF\u771F\u5B9E\u6267\u884C\uFF08\u9A71\u52A8 agent \u4F1A\u8BDD\uFF09\uFF1B\u4EFB\u52A1\u53EF\u9489\u4F4F\u6267\u884C\u76EE\u6807\u2014\u2014\u5DE5\u4F5C\u533A / \u6A21\u5F0F\uFF08agent \u9884\u8BBE\uFF09/ \u6743\u9650\uFF08read-only / workspace-write / danger-full-access\uFF09\uFF0C\u7F3A\u7701\u7528\u8FD0\u884C\u65F6\u9ED8\u8BA4\uFF1B\u4EFB\u52A1\u652F\u6301 5 \u6BB5 cron \u5B9A\u65F6\u6267\u884C\uFF08\u5982 0 23 * * *\uFF09\uFF1B\u4EFB\u52A1\u6570\u636E\u7531\u5BBF\u4E3B\u6301\u4E45\u5316\u5230\u5B58\u50A8\u76EE\u5F55\uFF08tasks.json\uFF09\u3002\u9650\u5236\uFF1A\u5B9A\u65F6\u8C03\u5EA6\u5728\u6D4F\u89C8\u5668\u7AEF\uFF0C\u9700 GUI \u6807\u7B7E\u9875\u6253\u5F00\uFF0C\u9519\u8FC7\u5373\u8DF3\u8FC7\uFF1B\u6267\u884C\u6D88\u8017 API \u989D\u5EA6\u3002\u7528\u6237\u63D0\u5230\u300C\u4EFB\u52A1\u770B\u677F / \u770B\u677F / \u5B9A\u65F6\u4EFB\u52A1\u300D\u65F6\u5373\u6307\u672C\u5DE5\u4F5C\u53F0\u7684\u770B\u677F\uFF0C\u8BF7\u636E\u6B64\u534F\u4F5C\u3002";
function registerTaskBoardPrompt(ctx) {
  const sp = ctx.get("systemPrompt");
  if (sp === void 0) return;
  sp.section({
    name: "plugin:bga-dsh-workbench-task-board",
    order: SECTION_ORDER,
    text: TASK_BOARD_GUIDANCE
  });
}

// src/index.ts
var name = "bga-dsh-workbench";
var inject = ["tools"];
var Config = Schema.object({
  avatarPath: Schema.string().default(""),
  text: Schema.string().default("\u7684\u4E13\u5C5E Harness \u5DE5\u4F5C\u53F0"),
  show: Schema.boolean().default(true),
  sound: Schema.boolean().default(true),
  storageDir: Schema.string().default(defaultStorageDir())
});
var DEFAULT_TEXT = "\u7684\u4E13\u5C5E Harness \u5DE5\u4F5C\u53F0";
function defaultStorageDir() {
  return join5(process.env.DSH_HOME ?? join5(homedir(), ".dsh"), "bga-dsh-workbench");
}
function apply(ctx, config) {
  const base = {
    banner: {
      avatarPath: config.avatarPath ?? "",
      text: config.text ?? DEFAULT_TEXT,
      show: config.show ?? true
    },
    confetti: {
      show: config.show ?? true,
      sound: config.sound ?? true
    },
    english: {
      enabled: true
    },
    open: {
      terminal: "",
      editor: ""
    },
    openExtra: {
      androidStudio: true,
      xcode: true,
      wechatDevtools: true,
      intellijIdea: true,
      devecoStudio: true,
      webstorm: true,
      pycharm: true,
      goland: true
    }
  };
  const storageDir = resolve2(config.storageDir ?? defaultStorageDir());
  ctx.inject(["webServer", "settings"], (child) => {
    const scope = registerWorkbenchSettings(child, base);
    const baseBanner = base.banner ?? {};
    const baseConfetti = base.confetti ?? {};
    const baseOpen = base.open ?? {};
    const baseOpenExtra = base.openExtra ?? {};
    const runtime = {
      // 读取当前生效的配置：先看设置命名空间里的值，非字符串/非布尔或为空时回退到基础配置
      resolve: () => {
        const resolved = scope.get();
        const banner = resolved.banner ?? {};
        const confetti = resolved.confetti ?? {};
        const open = resolved.open ?? {};
        const extraCfg = resolved.openExtra ?? {};
        return {
          banner: {
            avatarPath: typeof banner.avatarPath === "string" && banner.avatarPath.length > 0 ? banner.avatarPath : baseBanner.avatarPath ?? "",
            text: typeof banner.text === "string" && banner.text.length > 0 ? banner.text : baseBanner.text ?? "",
            show: typeof banner.show === "boolean" ? banner.show : baseBanner.show ?? true
          },
          confetti: {
            show: typeof confetti.show === "boolean" ? confetti.show : baseConfetti.show ?? true,
            sound: typeof confetti.sound === "boolean" ? confetti.sound : baseConfetti.sound ?? true,
            theme: confetti.theme ?? (baseConfetti.theme ?? "default"),
            intensity: confetti.intensity ?? (baseConfetti.intensity ?? "large"),
            trigger: confetti.trigger ?? (baseConfetti.trigger ?? "success")
          },
          english: {
            enabled: typeof resolved.english?.enabled === "boolean" ? resolved.english.enabled : true
          },
          open: {
            terminal: typeof open.terminal === "string" ? open.terminal : baseOpen.terminal ?? "",
            editor: typeof open.editor === "string" ? open.editor : baseOpen.editor ?? ""
          },
          openExtra: {
            androidStudio: typeof extraCfg.androidStudio === "boolean" ? extraCfg.androidStudio : baseOpenExtra.androidStudio ?? true,
            xcode: typeof extraCfg.xcode === "boolean" ? extraCfg.xcode : baseOpenExtra.xcode ?? true,
            wechatDevtools: typeof extraCfg.wechatDevtools === "boolean" ? extraCfg.wechatDevtools : baseOpenExtra.wechatDevtools ?? true,
            intellijIdea: typeof extraCfg.intellijIdea === "boolean" ? extraCfg.intellijIdea : baseOpenExtra.intellijIdea ?? true,
            devecoStudio: typeof extraCfg.devecoStudio === "boolean" ? extraCfg.devecoStudio : baseOpenExtra.devecoStudio ?? true,
            webstorm: typeof extraCfg.webstorm === "boolean" ? extraCfg.webstorm : baseOpenExtra.webstorm ?? true,
            pycharm: typeof extraCfg.pycharm === "boolean" ? extraCfg.pycharm : baseOpenExtra.pycharm ?? true,
            goland: typeof extraCfg.goland === "boolean" ? extraCfg.goland : baseOpenExtra.goland ?? true
          }
        };
      },
      // 更新设置命名空间中的横幅/彩带配置
      updateSettings: (patch) => scope.update(patch),
      // 保存上传的头像字节流：嗅探图片类型，写入存储目录并更新设置记录新路径
      saveAvatar: async (buffer) => {
        const ext = sniffImageType(buffer);
        if (ext === void 0) throw new Error("unsupported image type (png, jpg, gif, webp supported)");
        await mkdir3(storageDir, { recursive: true });
        const target = join5(storageDir, `avatar${ext}`);
        await writeFile3(target, buffer);
        await scope.update({ banner: { avatarPath: target } });
        return target;
      },
      storageDir
    };
    const disposers = createWorkbenchRoutes(runtime).map((route) => child.webServer.register(route));
    for (const route of createEnglishRoutes({
      storageDir,
      generateText: (topic, selection, nativeLang, targetLang) => generateEnglishText(child, topic, selection, nativeLang, targetLang),
      listModels: () => listEnglishModels(child),
      currentSelection: () => child.get("agentDefaultModel")?.currentSelection() ?? { provider: void 0, model: void 0 },
      saveSelection: async (selection) => {
        await child.get("agentDefaultModel")?.saveSelection(selection);
      }
    })) {
      disposers.push(child.webServer.register(route));
    }
    return () => {
      for (const dispose of disposers) dispose();
    };
  });
  registerTaskBoardPrompt(ctx);
}
export {
  Config,
  DEFAULT_TEXT,
  apply,
  inject,
  name
};
//# sourceMappingURL=index.js.map
