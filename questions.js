// ==========================================
// 题库与速查词典主数据 (支持多科目切换)
// ==========================================

const SUBJECT_DATA = {
  // ================= 1. 北京市情科目 =================
  beijing: {
    name: "北京市情",
    icon: "京",
    categories: [
      { id: "history", name: "历史与概况" },
      { id: "geography", name: "地理与人口" },
      { id: "transport", name: "交通运输" },
      { id: "culture", name: "文化与休闲" }
    ],
    facts: [
      { title: "定位与区划", cat: "history", content: "北京总面积 16410.54 平方千米，下辖 16 个区。2020年常住人口 2153.6 万人，城镇化率达 86.6%。" },
      { title: "建城与名称起源", cat: "history", content: "北京建城两千多年，最初见于记载的名称是“蓟”。公元前1045年成为蓟、燕都城。公元前221年秦统一后为北方重镇。" },
      { title: "历史别称演变", cat: "history", content: "北京历史上曾有二十多个别称。如：幽都（唐）、南京（五代）、中都（金）、大都及汗八里（元）、北平（明洪武）、北京（明永乐）。" },
      { title: "地势与北京弯", cat: "geography", content: "地势西北高、东南低。太行山余脉（西山）与燕山山脉（军都山）在南口关沟相交，环绕成向东南展开的半圆形大山弯，俗称“北京弯”。" },
      { title: "面积与地形构成", cat: "geography", content: "平原面积 6339 平方公里（占 38.6％），山区面积 10072 平方公里（占 61.4％）。最高峰为与河北交界的东灵山，海拔 2309 米。" },
      { title: "气候与降水规律", cat: "geography", content: "典型的暖温带半湿润大陆性季风气候。年均温 10-12℃。降水集中度极高，全年 80% 的雨水集中在夏季 6、7、8 三个月。" },
      { title: "市政府驻地迁址", cat: "geography", content: "北京市人民政府目前已正式搬迁并驻于通州区运河东大街 57 号。" },
      { title: "三大老火车站历史", cat: "transport", content: "北京站建于 1959 年；北京西站建于 1996 年；北京北站建于 1905 年（詹天佑主持的京张铁路车站，2009年改建）。" },
      { title: "亚洲第二大站", cat: "transport", content: "北京南站位于永外大街，于 2008 年改建完成，是京沪高铁的重要车站，其规模在亚洲火车站中仅次于上海虹桥站。" },
      { title: "地铁之最与起源", cat: "transport", content: "北京地铁1号线于 1969年10月1日 开通，是中国第一条地铁。2号线是环线。大兴机场线于 2019年9月26日 开通，仅有3个车站。" },
      { title: "机场格局", cat: "transport", content: "拥有两座大型民用机场：首都国际机场（顺义区，行政属朝阳）和大兴国际机场（大兴与廊坊交界，2019年通航）。另有 6 个军用机场。" },
      { title: "六大世界文化遗产", cat: "culture", content: "北京拥有 6 处世界文化遗产：故宫（1987）、长城（1987）、周口店北京人遗址（1987）、天坛（1998）、颐和园（1998）、明十三陵（2003）。" },
      { title: "燕京八景起源", cat: "culture", content: "说法最早见于金代《明昌遗事》。清乾隆年间，乾隆帝亲自修订并御书立碑，使得景观及描述正式固定下来。" },
      { title: "京剧源流", cat: "culture", content: "源于 1790 年安徽四大徽班（三庆、四喜、春公、和春）进京献艺，后与汉调艺人合作，吸收昆曲、秦腔精华发展出“二黄”和“西皮”唱腔。" },
      { title: "胡同之最", cat: "culture", content: "最古老：三庙街（900多年）；最长：东西交民巷（6.5里）；最短：十几米；最窄：前门钱市胡同（仅 0.7 米）。数量达 7000 余条。" }
    ],
    questions: [
{
        id: 1,
        type: "single",
        category: "history",
        categoryName: "历史与概况",
        question: "北京被世界城市研究机构 GaWC 评为哪个级别的城市？",
        options: ["世界一线城市", "世界二线城市", "世界三线城市", "世界准一线城市"],
        answer: "A",
        explanation: "根据北京市情概况，北京被世界城市研究机构 GaWC 评为世界一线城市，联合国报告指出北京人类发展指数居中国城市第二位。"
      },
{
        id: 2,
        type: "single",
        category: "history",
        categoryName: "历史与概况",
        question: "北京建城已有两千多年的历史，最初见于记载的名字是？",
        options: ["燕", "幽", "蓟", "涿"],
        answer: "C",
        explanation: "北京建城已有两千多年的历史，最初见于记载的名字为“蓟”。"
      },
{
        id: 3,
        type: "single",
        category: "history",
        categoryName: "历史与概况",
        question: "公元前 1045 年，北京成为哪两个诸侯国的都城？",
        options: ["齐、鲁", "秦、赵", "蓟、燕", "魏、韩"],
        answer: "C",
        explanation: "公元前 1045 年，北京成为蓟、燕等诸侯国的都城；公元前 221 年秦始皇统一中国以来，北京一直是中国北方重镇和地方中心。"
      },
{
        id: 4,
        type: "multiple",
        category: "history",
        categoryName: "历史与概况",
        question: "北京在历史上曾用过许多别称，下列属于北京历史别称的有？",
        options: ["幽都 (唐代)", "南京 (五代)", "中都 (金代)", "汗八里 (元代)"],
        answer: ["A", "B", "C", "D"],
        explanation: "北京在不同的朝代有着不同的称谓，大致算起来有二十多个别称。包括：蓟、幽州、幽都、南京、燕山、中都、大兴、大都、汗八里、北平、北京、京师等。"
      },
{
        id: 5,
        type: "multiple",
        category: "history",
        categoryName: "历史与概况",
        question: "下列属于秦汉至明清时期，北京曾作为行政治所或府名的有？",
        options: ["顺天府", "范阳郡", "析津府", "涿郡"],
        answer: ["A", "B", "C", "D"],
        explanation: "北京历史上，秦汉之时曾是广阳郡的治所；隋大业年间，曾是涿郡的治所；唐天宝年间，曾是范阳郡的治所；辽代时曾是析津府的治所；明清之时，曾是顺天府的治所。"
      },
{
        id: 6,
        type: "judgement",
        category: "history",
        categoryName: "历史与概况",
        options: ["正确", "错误"],
        question: "公元 1267 年，蒙古族首领忽必烈下令在中都城的东北郊筑建新城，建立了中国历史上的元朝。",
        answer: "A",
        explanation: "1267 年，蒙古族首领忽必烈下令在中都城的东北郊筑建新城。四年后这位首领即在兴建中的都城内登上皇帝宝座，建立了元朝。"
      },
{
        id: 7,
        type: "judgement",
        category: "history",
        categoryName: "历史与概况",
        options: ["正确", "错误"],
        question: "北京作为帝都的历史是在 1949 年中华人民共和国成立时宣告结束的。",
        answer: "B",
        explanation: "1911 年 10 月 10 日，中国爆发了资产阶级民主主义革命，第二年二月清帝被迫宣告退位。至此，中国最后一个封建王朝溃亡，北京作为帝都的历史到此结束。"
      },
{
        id: 8,
        type: "fill",
        category: "history",
        categoryName: "历史与概况",
        question: "早在七十万年前，北京周口店地区就出现了原始人群部落，被称为“______”。",
        answer: ["北京人", "北京猿人"],
        explanation: "早在七十万年前，北京周口店地区就出现了原始人群部落“北京人”（又称北京猿人）。"
      },
{
        id: 9,
        type: "fill",
        category: "history",
        categoryName: "历史与概况",
        question: "意大利旅行家马可·波罗在游记中将新建成的元朝都城称之为“______”。",
        answer: ["世界莫能与比", "元大都", "大都"],
        explanation: "1276 年新城全部建成，这便是意大利旅行家马可·波罗在游记中称之为“世界莫能与比”的元大都。"
      },
{
        id: 10,
        type: "single",
        category: "history",
        categoryName: "历史与概况",
        question: "截至2018年，北京市下辖多少个区？",
        options: ["14个", "15个", "16个", "18个"],
        answer: "C",
        explanation: "截至 2018 年，北京市下辖 16 个区，总面积 16410.54 平方千米。"
      },
{
        id: 11,
        type: "single",
        category: "history",
        categoryName: "历史与概况",
        question: "2019年末，北京市的常住外来人口达到多少万人？",
        options: ["500万", "794.3万", "1865万", "2153.6万"],
        answer: "B",
        explanation: "2019年末，全市常住人口 2153.6 万人，其中常住外来人口达 794.3 万人。"
      },
{
        id: 12,
        type: "single",
        category: "history",
        categoryName: "历史与概况",
        question: "北京的别称“燕山”出现在哪一年？",
        options: ["公元 938 年", "公元 1122 年", "公元 1153 年", "公元 1368 年"],
        answer: "B",
        explanation: "燕山（北宋宣和四年，公元 1122 年）。另外，南京别称出现于公元 938 年（辽代），中都出现于公元 1153 年（金代），北平出现于公元 1368 年（明代）。"
      },
{
        id: 13,
        type: "multiple",
        category: "history",
        categoryName: "历史与概况",
        question: "自公元 938 年以来，北京又先后成为哪些政权的国都或陪都？",
        options: ["辽陪都", "金上都", "元大都", "明清国都"],
        answer: ["A", "B", "C", "D"],
        explanation: "PDF原文记载：自公元 938 年以来，北京又先后成为辽陪都、金上都、元大都、明、清国都。"
      },
{
        id: 14,
        type: "judgement",
        category: "history",
        categoryName: "历史与概况",
        options: ["正确", "错误"],
        question: "春秋中期，位于蓟国西南面的封国燕吞并了蓟，并迁都于蓟城。当年的蓟城就在现北京城区的西南部。",
        answer: "A",
        explanation: "春秋中期，位于蓟国西南面的另一个封国燕，吞没了蓟，并迁都于蓟城。据考古学家考证，当年的蓟城就在现北京城区的西南部。"
      },
{
        id: 15,
        type: "judgement",
        category: "history",
        categoryName: "历史与概况",
        options: ["正确", "错误"],
        question: "公元 1153 年，女真人建立的金朝迁都燕京，并将其改名为大都。",
        answer: "B",
        explanation: "女真人建立的金朝将辽灭亡，并于 1153 年迁都燕京，改名“中都”（元朝新建的城才叫大都）。"
      },
{
        id: 16,
        type: "fill",
        category: "history",
        categoryName: "历史与概况",
        question: "北京（Beijing），简称“______”，古称燕京、北平，是中华人民共和国的首都。",
        answer: ["京"],
        explanation: "北京（Beijing），简称“京”，古称燕京、北平，是中华人民共和国的首都、直辖市、国家中心城市、超大城市。"
      },
{
        id: 17,
        type: "fill",
        category: "history",
        categoryName: "历史与概况",
        question: "公元前十一世纪时，第一个统治中国北方的西周分封国是“______”。",
        answer: ["蓟国", "蓟"],
        explanation: "北京最早见于文献的名称叫做蓟。公元前十一世纪时，蓟国是统治中国北方的西周王朝的一个分封国。"
      },
{
        id: 18,
        type: "single",
        category: "history",
        categoryName: "历史与概况",
        question: "根据联合国报告，北京市在全国城市中处于前列的人类发展指数排在第几位？",
        options: ["第一位", "第二位", "第三位", "第五位"],
        answer: "B",
        explanation: "联合国报告指出，北京人类发展指数居中国城市第二位。"
      },
{
        id: 19,
        type: "multiple",
        category: "history",
        categoryName: "历史与概况",
        question: "下列哪些属于明代之后北京曾使用的历史别称？",
        options: ["北平 (明洪武)", "北京 (明永乐)", "京师 (明永乐)", "大兴 (金代)"],
        answer: ["A", "B", "C"],
        explanation: "北平（明洪武元年，1368年）、北京（明永乐元年，1403年）、京师（明永乐十八年，1420年）均为明代别称。大兴是金代别称。"
      },
{
        id: 20,
        type: "single",
        category: "history",
        categoryName: "历史与概况",
        question: "2020年，北京市全年实现地区生产总值（GDP）按可比价格计算比上年增长了多少？",
        options: ["1.2%", "2.1%", "6.1%", "8.5%"],
        answer: "A",
        explanation: "2020 年，北京市全年实现地区生产总值 36102.6 亿元，按可比价格计算，比上年增长 1.2%。"
      },
{
        id: 21,
        type: "single",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京市的最高峰是哪座山？",
        options: ["香山", "妙峰山", "东灵山", "八达岭"],
        answer: "C",
        explanation: "与河北交界的东灵山海拔 2309 米，为北京市最高峰。"
      },
{
        id: 22,
        type: "single",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京平原的海拔高度一般在多少米之间？",
        options: ["5～20米", "20～60米", "60～100米", "100～200米"],
        answer: "B",
        explanation: "北京平原的海拔高度在 20～60 米，山地一般海拔 1000～1500 米。"
      },
{
        id: 23,
        type: "multiple",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京境内贯穿五大河，其中主要的河流包括？",
        options: ["永定河", "潮白河", "北运河", "拒马河"],
        answer: ["A", "B", "C", "D"],
        explanation: "北京境内贯穿五大河，主要是东部的潮白河、北运河，西部的永定河和拒马河。"
      },
{
        id: 24,
        type: "multiple",
        category: "geography",
        categoryName: "地理与人口",
        question: "关于北京市的土地面积和地貌比例，下列说法正确的有？",
        options: ["全市土地面积 16411 平方公里", "平原面积占 38.6％", "山区面积占 61.4％", "城区面积 87.1 平方公里"],
        answer: ["A", "B", "C", "D"],
        explanation: "北京全市土地面积 16411 平方公里。其中平原面积 6339 平方公里，占 38.6％。山区面积 10072 平方公里，占 61.4％。城区面积 87.1 平方公里。"
      },
{
        id: 25,
        type: "judgement",
        category: "geography",
        categoryName: "地理与人口",
        options: ["正确", "错误"],
        question: "北京的气候为典型的暖温带半湿润大陆性季风气候。",
        answer: "A",
        explanation: "北京的气候为典型的暖温带半湿润大陆性季风气候，夏季高温多雨，冬季寒冷干燥，春、秋短促。"
      },
{
        id: 26,
        type: "judgement",
        category: "geography",
        categoryName: "地理与人口",
        options: ["正确", "错误"],
        question: "北京市的降水季节分配非常均匀，一年四季都有充足的雨水。",
        answer: "B",
        explanation: "北京降水季节分配很不均匀，全年降水的 80% 集中在夏季 6、7、8 三个月，7、8 月常有暴雨。"
      },
{
        id: 27,
        type: "fill",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京市人民政府现驻于哪个区？",
        answer: ["通州区", "通州"],
        explanation: "北京市人民政府驻通州区运河东大街 57 号。"
      },
{
        id: 28,
        type: "fill",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京的地势西北高、东南低。西部是太行山山脉余脉的西山，北部是燕山山脉的军都山，两山在______相交，形成向东南展开的半圆形大山弯（俗称北京弯）。",
        answer: ["南口关沟", "关沟"],
        explanation: "西部是太行山山脉余脉的西山，北部是燕山山脉的军都山，两山在南口关沟相交，形成一个向东南展开的半圆形大山弯，人们称之为“北京弯”。"
      },
{
        id: 29,
        type: "single",
        category: "geography",
        categoryName: "地理与人口",
        question: "2019年末，北京市的城镇人口占常住人口的比重（城镇化率）为？",
        options: ["74.5%", "81.2%", "86.6%", "90.1%"],
        answer: "C",
        explanation: "2019年末，常住人口 2153.6 万人，城镇人口 1865 万人，城镇化率 86.6%。"
      },
{
        id: 30,
        type: "multiple",
        category: "geography",
        categoryName: "地理与人口",
        question: "关于北京话和普通话的关系，下列说法正确的有？",
        options: [
          "汉语标准语（普通话）以北京话为基础",
          "北京话的儿化音现象比普通话强得多",
          "北京话流传于北京城区，口音浓重的普通话常被称为“京片子”",
          "现代北京话和普通话在词汇和音韵上没有任何区别"
        ],
        answer: ["A", "B", "C"],
        explanation: "尽管汉语标准语以北京话为基础，但北京话和普通话还有一定的区别。北京话儿化音更强，有一些地方性词汇，且当代北京话也与20世纪初的北京话有区别。"
      },
{
        id: 31,
        type: "single",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京中心位置的经纬度大约是？",
        options: [
          "东经 116°20′、北纬 39°56′",
          "东经 116°23′、北纬 39°54′",
          "东经 115°40′、北纬 40°10′",
          "东经 117°00′、北纬 39°00′"
        ],
        answer: "A",
        explanation: "北京中心位置东经 116°20′、北纬 39°56′。另外在地理概况第三部分指出，中心位于北纬 39 度 54 分，东经 116 度 23 分，两处数据均源自PDF中不同章节，皆为参考值。"
      },
{
        id: 32,
        type: "single",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京市的无霜期大约为多少天？",
        options: ["120至150天", "150至180天", "180至200天", "220至240天"],
        answer: "C",
        explanation: "全年无霜期 180 至 200 天，西部山区较短。"
      },
{
        id: 33,
        type: "multiple",
        category: "geography",
        categoryName: "地理与人口",
        question: "关于北京地理山脉构造，下列说法正确的有？",
        options: [
          "西部是太行山山脉余脉的西山",
          "北部是燕山山脉的军都山",
          "三面环山，平原向渤海倾斜",
          "两山在南口关沟相交"
        ],
        answer: ["A", "B", "C", "D"],
        explanation: "北京地势西北高、东南低。西部是太行山山脉余脉的西山，北部是燕山山脉的军都山，两山在南口关沟相交，形成半圆形大山弯。西部、北部和东北部三面环山，东南部平原向渤海倾斜。"
      },
{
        id: 34,
        type: "judgement",
        category: "geography",
        categoryName: "地理与人口",
        options: ["正确", "错误"],
        question: "2019年末，北京市的常住人口比上年末减少了 0.6 万人，呈现微弱下降趋势。",
        answer: "A",
        explanation: "2019 年末全市常住人口 2153.6 万人，比上年末减少 0.6 万人。"
      },
{
        id: 35,
        type: "judgement",
        category: "geography",
        categoryName: "地理与人口",
        options: ["正确", "错误"],
        question: "北京市人民政府的工作部门共设置 45 个，其中办公厅和组成部门有 20 个，直属机构有 25 个。",
        answer: "B",
        explanation: "北京市人民政府设置工作部门 45 个，其中：办公厅和组成部门 25 个（而非20个），直属机构 20 个（而非25个）。"
      },
{
        id: 36,
        type: "fill",
        category: "geography",
        categoryName: "地理与人口",
        question: "2019年末，北京市常住人口的自然增长率为______‰。",
        answer: ["2.63"],
        explanation: "2019年末，常住人口出生率 8.12‰，死亡率 5.49‰，自然增长率 2.63‰。"
      },
{
        id: 37,
        type: "fill",
        category: "geography",
        categoryName: "地理与人口",
        question: "曾经北京及华北春季多发沙尘暴，2007年市区空气质量达到二级和好于二级的天数为______天，占全年总天数的 67.4%。",
        answer: ["246", "246天"],
        explanation: "市区空气质量达到二级和好于二级的天数为 246 天（2007 年），占全年总天数的 67.4%。"
      },
{
        id: 38,
        type: "single",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京市的市人大常委会以及市人民政府每届任期是多少年？",
        options: ["3年", "4年", "5年", "6年"],
        answer: "C",
        explanation: "北京市人民代表大会代表每届任期5年；北京市人民政府每届任期也是五年。"
      },
{
        id: 39,
        type: "multiple",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京市辖区内主要的平原河流（流向东南并最后汇入渤海）包括？",
        options: ["永定河", "潮白河", "北运河", "拒马河"],
        answer: ["A", "B", "C", "D"],
        explanation: "境内流经的主要河流有：永定河、潮白河、北运河、拒马河等，多由西北部山地发源，向东南蜿蜒流经平原地区，最后分别汇入渤海。"
      },
{
        id: 40,
        type: "single",
        category: "geography",
        categoryName: "地理与人口",
        question: "2019年，北京市三次产业构成的比例关系是？",
        options: [
          "0.3 : 16.2 : 83.5",
          "0.4 : 16.5 : 83.1",
          "1.0 : 20.0 : 79.0",
          "0.2 : 15.8 : 84.0"
        ],
        answer: "A",
        explanation: "2019年三次产业构成比例由上年的 0.4:16.5:83.1 变化为 0.3:16.2:83.5。按常住人口计算，全市人均地区生产总值为 16.4 万元。"
      },
{
        id: 41,
        type: "single",
        category: "transport",
        categoryName: "交通运输",
        question: "北京地铁 1 号线于哪一年正式开通，成为中国第一条地铁？",
        options: ["1959年", "1969年", "1971年", "1976年"],
        answer: "B",
        explanation: "北京地铁 1 号线全长 31.04km，起讫站点为苹果园站至四惠东站，开通日期为 1969 年 10 月 1 日，是中国第一条地铁。"
      },
{
        id: 42,
        type: "single",
        category: "transport",
        categoryName: "交通运输",
        question: "被称为亚洲第二大火车站，并于 2008 年改建完成的是哪个车站？",
        options: ["北京站", "北京西站", "北京南站", "北京北站"],
        answer: "C",
        explanation: "北京南站位于永外大街。2008 年改建完成，成为亚洲第二大的火车站，是京沪高速铁路的重要站点（仅次于铁路上海虹桥站）。"
      },
{
        id: 43,
        type: "multiple",
        category: "transport",
        categoryName: "交通运输",
        question: "下列哪些属于北京地铁线路中已全线开通的轨道交通线？",
        options: ["北京地铁 2 号线", "北京地铁 4 号线", "北京地铁 10 号线", "北京地铁 14 号线"],
        answer: ["A", "B", "C"],
        explanation: "根据表中备注，2号线（环线）、4号线和10号线均为全线开通。而14号线在2013年开通时仅为西段、东段和中段大部分，中段剩余段仍在建设中。"
      },
{
        id: 44,
        type: "multiple",
        category: "transport",
        categoryName: "交通运输",
        question: "北京大兴国际机场位于北京市哪个区与河北省哪个市的交界处？",
        options: ["大兴区", "房山区", "廊坊市", "保定市"],
        answer: ["A", "C"],
        explanation: "北京大兴国际机场位于北京市大兴区与河北省廊坊市的交界处，于 2019 年 9 月 25 日正式通航。"
      },
{
        id: 45,
        type: "judgement",
        category: "transport",
        categoryName: "交通运输",
        options: ["正确", "错误"],
        question: "北京北站建于 1905 年，是京张铁路上的车站之一，现北京北站于 2009 年改建完成。",
        answer: "A",
        explanation: "北京北站位于西直门，建于 1905 年，是京张铁路上的车站之一。现北京北站于 2009 年改建完成。"
      },
{
        id: 46,
        type: "judgement",
        category: "transport",
        categoryName: "交通运输",
        options: ["正确", "错误"],
        question: "北京市境内目前仅建有民用机场，不存在任何军用机场。",
        answer: "B",
        explanation: "北京还建有 6 座军用机场：北京南苑机场、北京良乡机场、北京西郊机场、北京沙河机场和北京八达岭机场等。"
      },
{
        id: 47,
        type: "fill",
        category: "transport",
        categoryName: "交通运输",
        question: "北京首都国际机场是中国国际航空公司的主要运营中心，它在行政区划上属于北京市______区，但地理位置位于顺义区。",
        answer: ["朝阳区", "朝阳"],
        explanation: "北京首都国际机场位于北京市顺义区（行政属朝阳区），距北京市中心 20 千米。"
      },
{
        id: 48,
        type: "fill",
        category: "transport",
        categoryName: "交通运输",
        question: "北京最早建立的火车站中，北京西站建于______年，北京站建于1959年。",
        answer: ["1996", "1996年"],
        explanation: "北京西站位于莲花池东路，建于 1996 年。北京站建于 1959 年。"
      },
{
        id: 49,
        type: "single",
        category: "transport",
        categoryName: "交通运输",
        question: "北京地铁中，开通于 2019 年 9 月 26 日，仅有 3 个站点的快速机场地铁线 is？",
        options: ["北京地铁首都机场线", "北京地铁大兴机场线", "北京地铁八通线", "北京地铁亦庄线"],
        answer: "B",
        explanation: "北京地铁大兴机场线起讫站点为草桥站至大兴机场站，全长 41.4km，站数为 3 站，开通日期为 2019.9.26，全线开通。"
      },
{
        id: 50,
        type: "multiple",
        category: "transport",
        categoryName: "交通运输",
        question: "在国际铁路运输方面，从北京出发的国际列车可以去往下列哪些国家？",
        options: ["俄罗斯", "蒙古国", "朝鲜", "越南"],
        answer: ["A", "B", "C", "D"],
        explanation: "国际铁路运输方面，经满洲里去往俄罗斯各城市、经二连浩特去往蒙古国乌兰巴托和朝鲜平壤以及去往越南河内的列车均从北京发车。"
      },
{
        id: 51,
        type: "single",
        category: "transport",
        categoryName: "交通运输",
        question: "北京地铁最早的环线地铁是哪一条，于1971年开通？",
        options: ["北京地铁 1 号线", "北京地铁 2 号线", "北京地铁 10 号线", "北京地铁 13 号线"],
        answer: "B",
        explanation: "根据地铁数据，北京地铁 2 号线全长 23.1km，起讫站点为西直门站至西直门站（环线），开通于 1971.1.15。"
      },
{
        id: 52,
        type: "single",
        category: "transport",
        categoryName: "交通运输",
        question: "北京地铁10号线全长约为多少千米，是全线开通的地铁线？",
        options: ["31.04km", "42.8km", "57.1km", "49.8km"],
        answer: "C",
        explanation: "北京地铁 10 号线全长 57.1km，起讫站点为巴沟站至巴沟站，开通日期为 2008.7.19，备注为“全线”。"
      },
{
        id: 53,
        type: "multiple",
        category: "transport",
        categoryName: "交通运输",
        question: "下列哪些属于北京 6 座军用机场之列？",
        options: ["北京南苑机场", "北京良乡机场", "北京西郊机场", "北京沙河机场"],
        answer: ["A", "B", "C", "D"],
        explanation: "北京建有的 6 座军用机场包括：北京南苑机场、北京良乡机场、北京西郊机场、北京沙河机场、北京八达岭机场等。"
      },
{
        id: 54,
        type: "judgement",
        category: "transport",
        categoryName: "交通运输",
        options: ["正确", "错误"],
        question: "2019年大兴国际机场正式通航。当年大兴机场共完成旅客量吞吐量超8000万人次，位居全球第二。",
        answer: "B",
        explanation: "旅客吞吐量超 8000 万（8192.9 万）人次的是 2012 年的北京首都国际机场。2019年大兴机场共完成旅客量吞吐量 313.5074 万人次。"
      },
{
        id: 55,
        type: "judgement",
        category: "transport",
        categoryName: "交通运输",
        options: ["正确", "错误"],
        question: "北京东站位于百子湾，建于 1938 年。",
        answer: "A",
        explanation: "北京东站位于百子湾，建于 1938 年。"
      },
{
        id: 56,
        type: "fill",
        category: "transport",
        categoryName: "交通运输",
        question: "北京地铁 8 号线开通于 2008 年，起讫点为瀛海站至珠市口站以及中国美术馆站至朱辛庄站，开通时被称为“______”。",
        answer: ["奥运支线"],
        explanation: "北京地铁 8 号线开通于 2008.7.19，备注中说明一起被称为“奥运支线”，三期建设中。"
      },
{
        id: 57,
        type: "fill",
        category: "transport",
        categoryName: "交通运输",
        question: "北京地铁首都机场线的起讫站点是从东直门站至______或2号航站楼站，共设 4 个站。",
        answer: ["3号航站楼站", "3号航站楼", "三号航站楼"],
        explanation: "北京地铁首都机场线起讫站点为东直门站至3号航站楼站或2号航站楼站，站数为 4 站。"
      },
{
        id: 58,
        type: "single",
        category: "transport",
        categoryName: "交通运输",
        question: "北京地铁 13 号线建于 2002 年，其起讫站点为？",
        options: ["西直门站至东直门站", "西直门站至西直门站", "苹果园站至四惠东站", "巴沟站至巴沟站"],
        answer: "A",
        explanation: "北京地铁 13 号线起讫站点为西直门站至东直门站，全长 40.9km，开通日期为 2002.9.28。"
      },
{
        id: 59,
        type: "multiple",
        category: "transport",
        categoryName: "交通运输",
        question: "下列关于北京各大火车站位置的描述，正确的有？",
        options: [
          "北京站位于东便门西侧",
          "北京南站位于永外大街",
          "北京西站位于莲花池东路",
          "北京北站位于西直门"
        ],
        answer: ["A", "B", "C", "D"],
        explanation: "这四座火车站的地理位置描述均完全正确。北京东站则位于百子湾。"
      },
{
        id: 60,
        type: "single",
        category: "transport",
        categoryName: "交通运输",
        question: "北京地铁中全长最长、达到 57.1km 的线路是？",
        options: ["地铁 6 号线", "地铁 10 号线", "地铁 13 号线", "地铁 16 号线"],
        answer: "B",
        explanation: "根据表格，地铁 10 号线全长 57.1km（设 45 站），是列出的所有线路中最长的一条。"
      },
{
        id: 61,
        type: "single",
        category: "culture",
        categoryName: "文化与休闲",
        question: "截至2020年，北京市共有几处联合国教科文组织认定的“世界遗产”？",
        options: ["5处", "6处", "7处", "8处"],
        answer: "B",
        explanation: "北京市共有 6 处世界遗产，分别是：故宫博物院（1987年）、长城（1987年）、周口店北京人遗址（1987年）、天坛（1998年）、颐和园（1998年）、明十三陵（2003年）。"
      },
{
        id: 62,
        type: "single",
        category: "culture",
        categoryName: "文化与休闲",
        question: "北京最古老的胡同是哪一条？",
        options: ["南锣鼓巷", "钱市胡同", "三庙街", "东西交民巷"],
        answer: "C",
        explanation: "经调查，北京最古老的胡同是三庙街，至今已有 900 多年的历史。"
      },
{
        id: 63,
        type: "multiple",
        category: "culture",
        categoryName: "文化与休闲",
        question: "下列属于北京市 6 处世界文化遗产之列的有？",
        options: ["天坛", "圆明园", "明十三陵", "周口店北京人遗址"],
        answer: ["A", "C", "D"],
        explanation: "北京的 6 处世界遗产为：故宫、长城、周口店北京人遗址、天坛、颐和园、明十三陵。圆明园虽是著名皇家园林，但目前非世界文化遗产。"
      },
{
        id: 64,
        type: "multiple",
        category: "culture",
        categoryName: "文化与休闲",
        question: "京剧是地道的中国国粹。1790 年先后进京献艺，并最终促成京剧诞生的安徽四大地方戏班（徽班）包括？",
        options: ["三庆班", "四喜班", "春公班", "和春班"],
        answer: ["A", "B", "C", "D"],
        explanation: "1790年，安徽的四大地方戏班——三庆班、四喜班、春公班、和春班先后进京献艺，获得空前成功。后与汉调艺人合作，兼收昆曲、秦腔等地方戏精华，诞生了京剧。"
      },
{
        id: 65,
        type: "judgement",
        category: "culture",
        categoryName: "文化与休闲",
        options: ["正确", "错误"],
        question: "北京最窄的胡同是位于前门大栅栏地区的钱市胡同，其宽度仅有 0.7 米。",
        answer: "A",
        explanation: "最窄的胡同要数前门大栅栏地区的钱市胡同，宽仅 0.7 米。"
      },
{
        id: 66,
        type: "judgement",
        category: "culture",
        categoryName: "文化与休闲",
        options: ["正确", "错误"],
        question: "北京传统的四合院建筑中，正房是指东西两侧的厢房，除大门外没有窗户或通道与胡同相连。",
        answer: "B",
        explanation: "四合院中，北房为正房，东西两侧为厢房（非正房），它们除大门外没有窗户或通道与胡同相连。"
      },
{
        id: 67,
        type: "fill",
        category: "culture",
        categoryName: "文化与休闲",
        question: "北京旧时的八个景观被称为“______”，包括卢沟晓月、金台夕照、西山晴雪、居庸叠翠等。",
        answer: ["燕京八景"],
        explanation: "北京旧时的八个景观被称为“燕京八景”。清乾隆年间，乾隆皇帝亲自主持修订了燕京八景的说法并下旨建造御书燕京八景碑，燕京八景的景观和描述才固定下来。"
      },
{
        id: 68,
        type: "fill",
        category: "culture",
        categoryName: "文化与休闲",
        question: "被誉为北京最长胡同的“东西交民巷”，其全长共有______里。",
        answer: ["6.5", "6.5里"],
        explanation: "北京最长的胡同就是东西交民巷，全长 6.5 里；最短的胡同，长不过十几米。"
      },
{
        id: 69,
        type: "single",
        category: "culture",
        categoryName: "文化与休闲",
        question: "北京著名的皇家园林中，被誉为“万园之园”，后在战争中被毁的是？",
        options: ["颐和园", "圆明园", "北海公园", "景山公园"],
        answer: "B",
        explanation: "圆明园是我国最有名的皇家园林，园中山青水绿，在中外园林史上享有盛誉，具有很高的艺术价值，被誉为“万园之园”。"
      },
{
        id: 70,
        type: "multiple",
        category: "culture",
        categoryName: "文化与休闲",
        question: "下列属于北京著名的民间传统手工艺特产的有？",
        options: ["景泰蓝", "京剧脸谱", "泥人", "剪纸"],
        answer: ["A", "B", "C", "D"],
        explanation: "北京历史悠久的特色特产和民间手工艺品非常丰富，包括景泰蓝、玉器、丝绸刺绣，以及泥人、京剧脸谱、风筝、剪纸等。"
      },
{
        id: 71,
        type: "single",
        category: "culture",
        categoryName: "文化与休闲",
        question: "建于 1420 年的天坛是北京最为著名的古迹之一。在明清两代，它是皇帝用来做什么的场所？",
        options: ["居住与朝会", "“祭天”和“祈谷”", "军事演练", "避暑游玩"],
        answer: "B",
        explanation: "天坛以其布局合理、构筑精妙而扬名中外，是明、清两代皇帝“祭天”和“祈谷”的地方，是我国现存最大的古代祭祀性建筑群。"
      },
{
        id: 72,
        type: "single",
        category: "culture",
        categoryName: "文化与休闲",
        question: "明十三陵是北京最大的皇家陵寝墓群，内有明代 13 个皇帝的陵墓，其中现代发掘的是哪一座陵墓？",
        options: ["长陵", "献陵", "定陵", "昭陵"],
        answer: "C",
        explanation: "明十三陵是北京最大的皇家陵寝墓群，内有明代 13 个皇帝的陵墓，尤其是现代发掘的明定陵，规模浩大，极为壮观。"
      },
{
        id: 73,
        type: "multiple",
        category: "culture",
        categoryName: "文化与休闲",
        question: "北京的宗教寺庙遍布京城，下列属于佛教著名寺庙的有？",
        options: ["法源寺", "潭柘寺", "戒台寺", "云居寺"],
        answer: ["A", "B", "C", "D"],
        explanation: "佛教著名寺庙有：法源寺、潭柘寺、戒台寺、云居寺、八大处等。白云观为道教，牛街为伊斯兰教，雍和宫为藏传佛教。"
      },
{
        id: 74,
        type: "judgement",
        category: "culture",
        categoryName: "文化与休闲",
        options: ["正确", "错误"],
        question: "北京最长的胡同是东西交民巷，全长 6.5 里；最短的胡同则是前门钱市胡同。",
        answer: "B",
        explanation: "最长的胡同是东西交民巷（6.5里），最短 of the 胡同长不过十几米（未特别说明名字）。而钱市胡同是“最窄”的胡同（宽仅0.7米）。"
      },
{
        id: 75,
        type: "judgement",
        category: "culture",
        categoryName: "文化与休闲",
        options: ["正确", "错误"],
        question: "北京市辖区内共有文物古迹 7309 项，其中有 99 处全国重点文物保护单位，326 处市级文物保护单位。",
        answer: "A",
        explanation: "全市共有文物古迹 7309 项，其中有 6 处世界遗产、2 处国家重点风景名胜区、1座国家历史文化名城、1座中国历史文化名村、99处全国重点文物保护单位、326处市级文物保护单位。"
      },
{
        id: 76,
        type: "fill",
        category: "culture",
        categoryName: "文化与休闲",
        question: "北京的胡同最早起源于元朝，“胡同”一词在______语中是“小街巷”的意思。",
        answer: ["蒙古", "蒙古语"],
        explanation: "胡同是最具北京特色的民居之一，最早起源于元朝，“胡同”一词在蒙古语中是“小街巷”的意思。"
      },
{
        id: 77,
        type: "fill",
        category: "culture",
        categoryName: "文化与休闲",
        question: "散落在市区的名人故居和王府一般都是比较正宗的四合院，如前海西街的______。",
        answer: ["恭王府"],
        explanation: "散落在市区的名人故居和王府一般都是比较正宗的四合院，如前海西街的恭王府。"
      },
{
        id: 78,
        type: "single",
        category: "culture",
        categoryName: "文化与休闲",
        question: "北京地区“八景”（后称燕京八景）的说法最早见于哪一部古代书籍？",
        options: [
          "金代古籍《明昌遗事》",
          "明代古籍《宛署杂记》",
          "清代古籍《宸垣志略》",
          "清代古籍《顺天府志》"
        ],
        answer: "A",
        explanation: "北京地区八景的说法最早见于金代古籍《明昌遗事》，此后历代方志包括《宛署杂记》（明）、《宸垣志略》（清）等对燕京八景均有提及。"
      },
{
        id: 79,
        type: "multiple",
        category: "culture",
        categoryName: "文化与休闲",
        question: "下列购物街区中，属于北京传统的商业区（非近年来新崛起的商业区）的有？",
        options: ["王府井大街", "前门大栅栏", "西单商业街", "中关村广场"],
        answer: ["A", "B", "C"],
        explanation: "王府井大街、前门大栅栏、西单商业街是北京的传统商业区；国贸商城、东方新天地、中关村广场是近年来新崛起的商业巨擘。"
      },
{
        id: 80,
        type: "single",
        category: "culture",
        categoryName: "文化与休闲",
        question: "北京最古老的寺庙，在北京建城 800 年前就已经建立的是？",
        options: ["潭柘寺", "云居寺", "法源寺", "白云观"],
        answer: "A",
        explanation: "主要为潭柘寺（北京最古老寺庙，在北京市建成 800 年前就已经建立）。"
      },
{
        id: 81,
        type: "single",
        category: "history",
        categoryName: "历史与概况",
        question: "北京建城至今已有3000余年的历史。辽代在此建都，称之为：",
        options: ["大都", "中都", "陪都南京", "中都大兴府"],
        answer: "C",
        explanation: "辽代将北京作为陪都，改称南京（又称燕京），是北京作为都城历史的开端之一。"
      },
{
        id: 82,
        type: "single",
        category: "history",
        categoryName: "历史与概况",
        question: "金朝正式迁都北京，称之为：",
        options: ["中都", "大都", "上京", "南京"],
        answer: "A",
        explanation: "公元1153年，金朝海陵王正式迁都北京，改名“中都”，这也是北京作为王朝正式都城的开始。"
      },
{
        id: 83,
        type: "single",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京周围环绕着多个山脉，其中位于北京西北部，作为防风固沙天然屏障的是：",
        options: ["太行山脉", "燕山山脉", "军都山", "西山山脉"],
        answer: "B",
        explanation: "燕山山脉呈东西走向，位于北京市北部和西北部，是北京重要的天然地理屏障。"
      },
{
        id: 84,
        type: "single",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京市面积最大的郊区区县是哪个？",
        options: ["密云区", "怀柔区", "延庆区", "房山区"],
        answer: "B",
        explanation: "北京市怀柔区总面积2122.8平方千米，是北京市面积最大的市辖区。"
      },
{
        id: 85,
        type: "single",
        category: "transport",
        categoryName: "交通运输",
        question: "下列火车站中，属于北京城市副中心线和京哈铁路交汇的重要枢纽站是：",
        options: ["北京东站", "北京朝阳站", "通州站", "乔庄东站"],
        answer: "C",
        explanation: "通州站是京哈铁路上的车站，也是北京城市副中心线的重要始发/经停站。"
      },
{
        id: 86,
        type: "single",
        category: "transport",
        categoryName: "交通运输",
        question: "北京大兴国际机场的航站楼构型呈现六指廊放射状，其中心点延伸至各指廊末端最大步行距离仅为：",
        options: ["300米", "600米", "800米", "1000米"],
        answer: "B",
        explanation: "大兴国际机场设计极其科学，旅客从航站楼中心步行至最远登机口的最大距离仅为600米，步行时间仅约8分钟。"
      },
{
        id: 87,
        type: "single",
        category: "culture",
        categoryName: "文化与休闲",
        question: "北京唯一的国家级运河文化主题公园位于：",
        options: ["朝阳区双桥", "通州区北运河畔", "顺义区潮白河畔", "昌平区温榆河畔"],
        answer: "B",
        explanation: "运河文化广场和运河森林公园位于通州区北运河畔，是展示大运河水利文化、漕运历史的代表性公园。"
      },
{
        id: 88,
        type: "single",
        category: "culture",
        categoryName: "文化与休闲",
        question: "被誉为“北京西山脊梁”和百里画廊代表，拥有丰富红色革命文化与地质资源的是：",
        options: ["妙峰山", "百花山", "灵山", "红螺山"],
        answer: "A",
        explanation: "门头沟妙峰山具有极其深厚的红色历史底蕴（抗平西情报站等）以及独特的山地自然风光。"
      },
{
        id: 89,
        type: "single",
        category: "history",
        categoryName: "历史与概况",
        question: "北京在元代正式作为全国性大一统王朝的首都，元代称北京为：",
        options: ["大都", "中都", "燕京", "北平"],
        answer: "A",
        explanation: "元代忽必烈在此营建城池，定都并命名为“大都”，奠定了现代北京城的基础格局。"
      },
{
        id: 90,
        type: "single",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京市的母亲河，也是北京境内流域面积最大的水系是：",
        options: ["潮白河", "温榆河", "永定河", "大清河"],
        answer: "C",
        explanation: "永定河是海河海系的最大支流，流经北京多区，被誉为北京的“母亲河”。"
      },
{
        id: 91,
        type: "single",
        category: "transport",
        categoryName: "交通运输",
        question: "连接北京市区与雄安新区的高速公路（京雄高速）北京段在2023年底已实现全线通车。京雄高速的起点位于：",
        options: ["南五环立交", "西南四环五棵松", "京港澳高速杜家坎", "宛平桥"],
        answer: "A",
        explanation: "京雄高速北京段起点位于南五环路，向南延伸跨越六环直至雄安新区，是拉动两地协同发展的交通主动脉。"
      },
{
        id: 92,
        type: "single",
        category: "culture",
        categoryName: "文化与休闲",
        question: "北京著名的“三山五园”主要分布在北京市的哪个区？",
        options: ["东城区", "西城区", "朝阳区", "海淀区"],
        answer: "D",
        explanation: "三山五园（香山、玉泉山、万寿山；静宜园、静明园、颐和园、圆明园、畅春园）均分布在海淀区，是皇家园林集聚区。"
      },
{
        id: 93,
        type: "single",
        category: "history",
        categoryName: "历史与概况",
        question: "明代永乐皇帝朱棣正式迁都北京，并进行大规模改建。明清北京城的核心中轴线南起永定门，北至：",
        options: ["天安门", "地安门", "钟鼓楼", "景山公园"],
        answer: "C",
        explanation: "北京历史文化中轴线全长7.8公里，南起永定门，经正阳门、天安门、故宫、景山，北至钟鼓楼。"
      },
{
        id: 94,
        type: "single",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京市的常住人口呈现外来人口和中心城区聚集的特点。北京常住人口数量最多的市辖区是：",
        options: ["朝阳区", "海淀区", "昌平区", "丰台区"],
        answer: "A",
        explanation: "朝阳区是北京市常住人口最多的区，其次是海淀区。"
      },
{
        id: 95,
        type: "single",
        category: "transport",
        categoryName: "交通运输",
        question: "北京城市副中心站综合交通枢纽建成后，将实现多条铁路与地铁的交汇。以下不属于在此交汇的铁路是：",
        options: ["京唐城际铁路", "城际铁路联络线", "京哈铁路", "京滨城际铁路分支"],
        answer: "C",
        explanation: "副中心站枢纽主要连接京唐城际、城际联络线等新建城际轨道，而老京哈铁路并不穿过该地下枢纽站厅。"
      },
{
        id: 96,
        type: "single",
        category: "culture",
        categoryName: "文化与休闲",
        question: "北京拥有丰富的长城文化资源。其中被称为“万里长城第一雄关”，位于昌平区境内的是：",
        options: ["八达岭长城", "居庸关长城", "慕田峪长城", "司马台长城"],
        answer: "B",
        explanation: "居庸关长城位于北京市昌平区，是长城沿线著名的古关隘，有“天下第一雄关”之称。"
      },
{
        id: 97,
        type: "single",
        category: "history",
        categoryName: "历史与概况",
        question: "北京历史上曾多次改名。在辛亥革命后，中华民国曾设立“京都市”，后南京国民政府时期改北京为：",
        options: ["北平市", "中京市", "顺天府", "大兴市"],
        answer: "A",
        explanation: "1928年南京国民政府将首都迁往南京，撤销京都市，改设“北平特别市”（后改称北平市），直到1949年开国大典恢复北京名称。"
      },
{
        id: 98,
        type: "single",
        category: "geography",
        categoryName: "地理与人口",
        question: "北京大兴国际机场跨越了两个行政省市，具体是指：",
        options: ["北京市与天津市", "北京市与河北省廊坊市", "北京市与河北省保定市", "北京市与河北省雄安新区"],
        answer: "B",
        explanation: "北京大兴国际机场位于北京市大兴区榆垡镇、礼贤镇 and 河北省廊坊市广阳区之间，跨越京冀两地。"
      },
{
        id: 99,
        type: "single",
        category: "transport",
        categoryName: "交通运输",
        question: "北京轨道交通建设规模居全国前列。北京首条开通运行的地铁线路是（现地铁1号线的前身，开通于1969年）：",
        options: ["北京地下铁道一期工程", "环城地铁线", "二号线", "十三号线"],
        answer: "A",
        explanation: "1969年10月1日，北京地下铁道一期工程（北京站至古城路）建成通车，这是中国第一条地下铁道线路。"
      },
{
        id: 100,
        type: "single",
        category: "culture",
        categoryName: "文化与休闲",
        question: "世界文化遗产北京大运河中，作为漕运终点，被定位为大运河文化带建设核心承载区的是：",
        options: ["什刹海历史文化街区", "通州大运河森林公园", "通州燃灯塔及周边古建筑群", "积水潭汇通祠"],
        answer: "C",
        explanation: "通州是大运河的漕运终点，“燃灯塔”是古运河漕运的重要地标 and 漕运终点象征，是运河文化带建设的重点。"
      }
    ]
  },
  idioms: {
    name: "成语700词",
    icon: "言",
    categories: [
      { id: "group1", name: "第一组 (T1~T18)" },
      { id: "group2", name: "第二组 (T19~T37)" },
      { id: "group3", name: "第三组 (T38~T56)" },
      { id: "group4", name: "第四组 (T57~T73)" },
      { id: "group5", name: "第五组 (T74~T93)" },
      { id: "group6", name: "第六组 (T94~T111)" },
      { id: "group7", name: "第七组 (T112~T134)" }
    ],
    facts: [
      { title: "多姿多彩", cat: "group1", content: "形容颜色和姿态多样，在例句中常用于修饰文化内部生成的丰富形态特征。" },
      { title: "历久弥新", cat: "group1", content: "指经历长久的时间而更加鲜活，更加显现出强大的生命力。侧重经过时间磨炼显出活力。" },
      { title: "独辟蹊径", cat: "group1", content: "独自开辟一条新路。比喻独创一种新风格或新方法。侧重于创造前人没有走过的独特路径。" },
      { title: "举步维艰", cat: "group1", content: "迈步艰难，比喻办事情每一步都很艰难。侧重处境艰难，行动极为困难。" },
      { title: "固步自封", cat: "group1", content: "比喻守着老一套，不求进步。侧重于主观上保守、不愿意主动接受改变。" },
      { title: "吐故纳新", cat: "group1", content: "原指人呼吸时吐出浊气吸进新鲜空气。现多比喻扬弃旧的、吸收新的（常形容队伍新老代谢）。" },
      { title: "东窗事发", cat: "group1", content: "比喻阴谋、贪腐或不法勾当败露。通常贬义极强，对应查处罪案的败露暴露。" },
      { title: "左支右绌", cat: "group1", content: "形容力量不足，顾此失彼。也常用来形容资金短缺或宏观调控时手忙脚乱的困境。" },
      { title: "独木难支", cat: "group1", content: "一根木头支不住大厦。比喻一个人的力量维系不住濒临崩溃的局面。常形容仅靠单一力量难以为继。" },
      { title: "浮光掠影", cat: "group1", content: "比喻观察不细致，学习不深入，印象不深刻。侧重只看到表面的浮光，不够透彻。" },
      { title: "见微知著", cat: "group2", content: "看到微小的苗头就能知道其本质和发展趋势。比喻具有敏锐的观察力和前瞻预判能力。" },
      { title: "相得益彰", cat: "group2", content: "两者互相配合，双方的能耐和作用更能显示出来。侧重两者的互相成全和强化。" },
      { title: "并行不悖", cat: "group2", content: "同时进行，互相不冲突。常形容两件事物虽然性质不同，但可以共同平稳发展。" },
      { title: "见贤思齐", cat: "group2", content: "见到贤人，就想向他看齐。侧重主动向优秀的人或事物学习、靠拢。" },
      { title: "闻过则喜", cat: "group2", content: "听到别人批评自己的缺点就高兴。形容虚心接受意见的气度。" }
    ],
    questions: [

{
        id: 101,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题1（2019年浙江省考）\n中国文化的博大精深，来源于其内部生成的________；中国文化的________，取决于其变迁过程中各种元素、层次、类型在内容和结构上通过碰撞、________、融合而产生的革故鼎新的强大动力。",
        options: ["绵延不绝 长盛不衰 交流", "源远流长 与时俱进 对话", "多姿多彩 历久弥新 解构", "千姿百态 推陈出新 重构"],
        answer: "C",
        explanation: "正确答案为：C（多姿多彩 历久弥新 解构）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 102,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题2（2018年联考）\n________的中华民族发展史是中国人民书写的，________的中华文明是中国人民创造的，________的中华民族精神是中国人民培育的，中华民族迎来了从站起来、富起来到强起来的伟大飞跃是中国人民奋斗出来的。",
        options: ["波澜壮阔 博大精深 历久弥新", "恢弘壮丽 源远流长 同舟共济", "气势磅礴 奔流不息 与时俱进", "延绵不断 厚积薄发 奋发有为"],
        answer: "A",
        explanation: "正确答案为：A（波澜壮阔 博大精深 历久弥新）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 103,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题3（2024年深圳）\n“从地名看文化，从文化看中国”，带着________的节目宗旨和不断精进的艺术手法，新一季《中国地名大会》以地名知识为载体，从地理风貌、民间习俗、历史文化、文学作品、特色美食等多个维度全方位全景式展现中华文化，________祖国大地的精彩纷呈，书写中国之进、阐释中国之变。",
        options: ["一脉相承 擘画", "薪火相传 描摹", "一脉相承 描摹", "薪火相传 擘画"],
        answer: "C",
        explanation: "正确答案为：C（一脉相承 描摹）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 104,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题4（2023年浙江事业单位）\n年画样式匮乏在源头上卡住了聊城木版年画传承的脖子，年画成品的严重雷同使得市场日渐________及传承人传承收益低微，这导致传承几乎________。非物质文化遗产保护活动虽为聊城木版年画传承创设了一个良好的社会环境，但欲实现其良性传承还需多下功夫，如政府协助建立传承人队伍等。",
        options: ["低沉 青黄不接", "消沉 难以为继", "缩小 后继无人", "低迷 半青半黄"],
        answer: "C",
        explanation: "正确答案为：C（缩小 后继无人）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 105,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题5（2023年深圳市考）\n（1）一边把那些态度不端、动机不纯的人淘汰出去，一边把那些具有正确认识、心怀理性期待的人吸收进来，公务员队伍就能________、生生不息，公务员职业就能回归行使公权、服务公众的本位。（2）一些腐败分子由于存在侥幸心理，仍然会铤而走险。他们觉得只要做得滴水不漏，就不可能________，也就不可能查到自己的头上。",
        options: ["吐故纳新 原形毕露", "除旧布新 东窗事发", "除旧布新 原形毕露", "吐故纳新 东窗事发"],
        answer: "D",
        explanation: "正确答案为：D（吐故纳新 东窗事发）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 106,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题6（2018年国考）\n早在上世纪70年代末，钱学森就曾多次提出：国防科技的发展不能________于“追尾巴”“照镜子”，而是要________地开拓新领域和新方向。比如英国人针对重机枪机动性差的弱点，发明了坦克，一举撕裂了枪炮林立的僵持局面。这类非对称式的发展思路有助于打破先进国家的技术垄断，形成后发优势。",
        options: ["拘泥 与众不同", "满足 独辟蹊径", "沉迷 标新立异", "止步 别具匠心"],
        answer: "B",
        explanation: "正确答案为：B（满足 独辟蹊径）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 107,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题7（2023年新疆）\n中国元素与现代奥运的激情碰撞、科技赋能下的________、独具东方美学色彩的审美意象……2022年北京冬奥会、冬残奥会虽然已落下帷幕，但“两个奥运”中形象鲜活的中国元素与创意无限的艺术________将永远镌刻在奥林匹克的历史中。",
        options: ["别出心裁 反响", "匠心独运 呈现", "推陈出新 构思", "标新立异 表达"],
        answer: "B",
        explanation: "正确答案为：B（匠心独运 呈现）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 108,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题8（2021年甘肃省考）\n我国有很庞大的老年群体，但他们却因为科技的发展，在生活中有很多地方________。不是他们________，不想接触新事物，而是一辈子的习惯，不是说改就能改的。",
        options: ["寸步难行 墨守成规", "步履艰难 画地为牢", "艰难跋涉 抱残守缺", "举步维艰 固步自封"],
        answer: "D",
        explanation: "正确答案为：D（举步维艰 固步自封）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 109,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题9（2017年联考）\n中国绘画是以庄子哲学为精神宗旨的，其最高境界是在人与对象的双重自然状态下实现物我浑融。《庄子·田子方》载，宋元君招试画师，应试者皆________，唯有一后到者，“解衣盘礴赢”，任性自然地投身于画作。宋元君称此人为“真画者”。所谓“真画者”，指的是突破规范束缚而进入自由率真的创作状态的画家。这是庄子为后世中国画家塑造的模范。填入划横线部分最恰当的一项是：",
        options: ["循规蹈矩", "墨守成规", "按部就班", "循规拘礼"],
        answer: "D",
        explanation: "正确答案为：D（循规拘礼）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 110,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题10（2014年国考）\n迟迟没有落地的补贴细则，让有意投资光伏发电站的企业们对光伏发电站的大蛋糕________。上周，据某研究人员透露，对光伏发电站的补贴已经纳入到财政预算，将“缺多少补多少”，但大部分企业对此却依然________。在补贴不到位情况下，企业还将面临垫资的风险，因此就整个光伏发电站市场而言，资金实力雄厚的大企业占据主导地位是________的。",
        options: ["望尘莫及 优柔寡断 不证自明", "望而却步 将信将疑 不言而喻", "望而生畏 犹豫不决 有目共睹", "望洋兴叹 举棋不定 显而易见"],
        answer: "B",
        explanation: "正确答案为：B（望而却步 将信将疑 不言而喻）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 111,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题11（2020年国考）\n中国正处于经济结构转型升级和世界新一轮技术革命的交汇时期，创新驱动高质量发展渐成共识。没有管理创新、市场创新的商业创新模式________，有真实需求场景的教育、医疗健康、信息消费、消费升级等模式创新领域，将会迸发出新的投资机会。填入划横线部分最恰当的一项是：",
        options: ["举步维艰", "日薄西山", "难以为继", "岌岌可危"],
        answer: "C",
        explanation: "正确答案为：C（难以为继）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 112,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题12（2019年黑龙江边境）\n当年的松阳也曾随着城市化进程的加速而________，村里人不是选择进城务工，就是迁居城镇，乡村中留下的大都是老人孩子，很多老屋闲置了，破败了，无人管理维护，保存状况________。幸运的是，无数的人因此行动起来，才有了今天________的松阳。",
        options: ["萧索 奄奄一息 生意盎然", "凋敝 危若朝露 朝气蓬勃", "凋零 危在旦夕 欣欣向荣", "萧条 岌岌可危 生机勃勃"],
        answer: "D",
        explanation: "正确答案为：D（萧条 岌岌可危 生机勃勃）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 113,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题13（2021年北京市考）\n公众对科普活动参与度越高，越有助于科学素质的提升；公众科学素质越高，科普事业也随之________。两者的良性循环，无疑会________出科学事业和创新驱动战略的一片沃土，培育出更多的创新人才和高素质创新大军。",
        options: ["水涨船高 涵养", "日臻完善 挖掘", "一日千里 开拓", "方兴未艾 积蓄"],
        answer: "A",
        explanation: "正确答案为：A（水涨船高 涵养）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 114,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题14（2019年联考）\n关于科学革命的讨论________于十七世纪。不过，其时革命尚在________地展开，相关讨论的焦点集中在科学的本性，而未有所谓“科学革命史”的理解。到十九世纪，现代科学的基本模式逐渐定型，一些学者便回到现代科学的源头做起了编史和整理工作。",
        options: ["滥觞 如火如荼", "起源 风起云涌", "溯源 轰轰烈烈", "发端 方兴未艾"],
        answer: "A",
        explanation: "正确答案为：A（滥觞 如火如荼）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 115,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题15（2019年四川选调）\n20多年过去，原始创新，集成创新，引进消化吸收再创新，中国迅速缩短了同发达国家在信息领域的差距，成为了拥有国民最多的网络大国，一大批颇具竞争力的网信企业________，一大批市场需求旺盛的新应用________，引领着经济的转型升级，也倒逼着治理体系体制机制的改革创新。",
        options: ["如鱼得水 屡见不鲜", "异军突起 层出不穷", "崭露头角 比比皆是", "雨后春笋 数不胜数"],
        answer: "B",
        explanation: "正确答案为：B（异军突起 层出不穷）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 116,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题16（2019年福建选调）\n随着科学技术在农村的迅速普及，近年来，一大批优秀乡土人才在农村________。他们既有勤奋学习、刻苦研究的精神，又有丰富的实践经验，成为科学致富的一代新型农民。填入划横线部分最恰当的一项是：",
        options: ["脱颖而出", "崭露头角", "闻名遐迩", "扬名天下"],
        answer: "A",
        explanation: "正确答案为：A（脱颖而出）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 117,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题17（2015年联考）\n社会性的焦虑特属于某些社会或时代，它是一种________的心神不安和精神不宁，是一种弥漫于社会不同阶层的焦虑。它不会轻易消退，不容易通过心理的调适而化解，人们所焦虑的对象或有不同。但在其性质和内容上又存在着一些共性。就如贫困者或忧虑自己的生存缺乏保障，而富有者也可能忧虑自己的财产缺乏保障。两者虽然不可________，而忧虑则相同。",
        options: ["特有 混为一谈", "广泛 等量齐观", "普遍 相提并论", "固有 同日而语"],
        answer: "B",
        explanation: "正确答案为：B（广泛 等量齐观）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 118,
        type: "single",
        category: "group1",
        categoryName: "第一组 (T1~T18)",
        question: "例题18（2018年浙江选调）\n面对时下大数据时代奔涌的多元、多源、异构的海量数据，无论是被美誉为“孕育了现代科学”的统计科学，还是应大科学之运而生、正如日中天的数据科学，也都只能________。今日之大数据，明日之大信息，扭转乾坤者，还属革新后的统计科学与数据科学。填入划横线部分最恰当的一项是：",
        options: ["望其项背", "望洋兴叹", "可见一斑", "浅尝辄止"],
        answer: "B",
        explanation: "正确答案为：B（望洋兴叹）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 119,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题19（2023年国考）\n当前背景下，宏观调控既要“防风险”又要“稳增长”。传统的逆周期调节能够较好地应对经济的短期波动，面对国内外经济的长期结构性调整则常常________。这就要求宏观调控________而跨周期调节正是在顶层设计的宏观调控框架下，促进不同政策工具的关联匹配，因此更能满足现阶段的调控要求。",
        options: ["捉襟见肘 与时俱进", "左支右绌 另辟蹊径", "有心无力 推陈出新", "难以为继 统筹兼顾"],
        answer: "B",
        explanation: "正确答案为：B（左支右绌 另辟蹊径）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 120,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题20（2017年联考）\n虽然没有法律强制力做支撑的道德是虚妄的，但是法律在面对道德问题时，也总是会显得________，这种力不从心的根本原因还是由于法律的外在属性与道德的内在属性之间的矛盾。社会秩序的大厦是法律与道德共同支撑的，如果道德不立，人心善变，那法律终会________。",
        options: ["相形见绌 回天乏术", "爱莫能助 孤立无援", "左支右绌 独木难支", "捉襟见肘 力所不逮"],
        answer: "C",
        explanation: "正确答案为：C（左支右绌 独木难支）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 121,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题21（2021年广西区考）\n区块链的诸多特征使其成为一项备受期待的革命性技术，而目前这一技术的应用潜能还远未被完全开发。今天我们看到的区块链技术在金融、物流、医疗、保险等领域的应用，仅是________般的一瞥所见，尚有许多应用正在被尝试、推广。填入划横线部分最恰当的一项是：",
        options: ["浮光掠影", "走马观花", "蜻蜓点水", "浅尝辄止"],
        answer: "A",
        explanation: "正确答案为：A（浮光掠影）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 122,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题22（2023年甘肃省考）\n针对人民教育出版社小学数学教材插图问题，教育部高度重视，________，对全国中小学教材教辅和进入校园课外读物的插图及内容进行了全面排查整改，确保体现正确的政治方向和价值导向，弘扬中华优秀文化，符合大众审美习惯。填入划横线部分最恰当的一项是：",
        options: ["举一反三", "一蹴而就", "融会贯通", "见微知著"],
        answer: "A",
        explanation: "正确答案为：A（举一反三）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 123,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题23（2022年浙江省考）\n改革和法治如鸟之两翼、车之两轮。党的十八大以来，全面深化改革的一个鲜明特点，就是把法治贯穿于改革全过程，在法治下推进改革、在改革中完善法治，保证改革和法治相互促进、________。填入划横线部分最恰当的一项是：",
        options: ["交相辉映", "相映成趣", "相得益彰", "相为表里"],
        answer: "C",
        explanation: "正确答案为：C（相得益彰）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 124,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题24（2021年青海省考）\n实际上普通话和方言不是同一层次上的交际工具。普通话是全民共同语，是官方语言，而方言是区域性的，是民间语言。通过明确________，普通话和方言可以做到并行不悖，甚至________，相得益彰。",
        options: ["规定 齐头并进", "划分 互为表里", "区分 珠联璧合", "界定 相辅相成"],
        answer: "D",
        explanation: "正确答案为：D（界定 相辅相成）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 125,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题25（2020年国考）\n古城区发展到一定阶段，适度的提升改造是必要的，但如果是通过“拆真”来为“建假”腾出地方，这样的开发改造必然是________。其实，提升改造与对老建筑的保护本来可以________，恰当地修缮，不但可以让历史建筑重新焕发活力，也能够提升城区的整体质量，达到提升改造的目的。",
        options: ["顾此失彼 齐头并进", "暴殄天物 双管齐下", "得不偿失 并行不悖", "舍本逐末 并驾齐驱"],
        answer: "C",
        explanation: "正确答案为：C（得不偿失 并行不悖）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 126,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题26（2022年国考）\n安装监控补光灯的目的在于更好地识别车辆信息，从而提高执法效率，存留违法车辆的有效证据。然而，交通执法的根本目的在于维护道路交通安全，如果执法手段本身对于交通安全构成了隐患甚至不幸导致事故，那么无疑是________。",
        options: ["得不偿失", "本末倒置", "背道而驰", "因小失大"],
        answer: "B",
        explanation: "正确答案为：B（本末倒置）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 127,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题27（2019年甘肃省考）\n为了迎合家长急于求成的心理需求，不少美术类培训机构纷纷带孩子参加各类绘画大赛和少儿绘画考级活动。这必然是________的做法，绘画是人们认识和感受世界，表达个人情绪和看法的一种方式，是培养孩子对现实世界的认知能力。作为家长，不要急于让孩子出成果、获大奖，而应该________孩子用更加丰富的手段认识世界。",
        options: ["拔苗助长 辅助", "缘木求鱼 激励", "舍本逐末 引导", "得不偿失 启发"],
        answer: "C",
        explanation: "正确答案为：C（舍本逐末 引导）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 128,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题28（2021年事业单位联考）\n我们通过守正创新形成了中国特色社会主义理论体系，守正就不能偏离马克思主义、社会主义，但不是________，还要往前发展、与时俱进，否则就是僵化的、陈旧的、过时的。填入划横线部分最恰当的一项是：",
        options: ["刻舟求剑", "缘木求鱼", "邯郸学步", "削足适履"],
        answer: "A",
        explanation: "正确答案为：A（刻舟求剑）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 129,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题29（2022年国考）\n大多数时候，面对孩子的成长，我们只是旁观者。我们所能做的是抚养与教育，陪伴与关爱，扶持与鼓励。既不能放纵不管，也不能________，更不能________。对于成长中的孩子，我们只是助力者。依次填入画横线部分最恰当的一项是：",
        options: ["大包大揽 听之任之", "越俎代庖 揠苗助长", "耳提面命 溺爱不明", "疾言厉色 娇生惯养"],
        answer: "B",
        explanation: "正确答案为：B（越俎代庖 揠苗助长）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 130,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题30（2021年广东省考）\n审美教育是一种________的动态教育，应当把道德教育通过审美意象和艺术形象的情感感染，贯穿到家庭教育、学校教育、社会教育全过程。填入划横线部分最恰当的一项是：",
        options: ["谆谆不倦", "春风化雨", "潜移默化", "耳濡目染"],
        answer: "C",
        explanation: "正确答案为：C（潜移默化）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 131,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题31（2018年贵州选调）\n在实现中华文化伟大复兴的历史征程中，悠久的诗教传统具有了________的土壤与需求。诗教不仅可以“兴观群怨”，可以提升人格、净化精神世界，更可以通过今天所提倡和大力加强的“美育”与“德育”，复兴这一传统文化精神，凝聚人心，________，推动当代伟大实践",
        options: ["勃兴 成风化人", "蓬勃 春风化雨", "发展 和风细雨", "兴旺 潜移默化"],
        answer: "A",
        explanation: "正确答案为：A（勃兴 成风化人）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 132,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题32（2021年新疆区考）\n科研需要踏踏实实，需要兢兢业业，更不要说需要夜以继日、________了。那么，一个科研工作者——即使是诺贝尔奖得主，怎么可能在走马观花中，只蜻蜓点水般地在某处站站脚、说些话，就能________了？",
        options: ["专心致志 扭转乾坤", "废寝忘食 脱胎换骨", "殚精竭虑 点石成金", "披星戴月 画龙点睛"],
        answer: "C",
        explanation: "正确答案为：C（殚精竭虑 点石成金）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 133,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题33（2022年湖北省考）\n中国的全面小康，犹如一幅前后相续的长卷，有________的创业征程，有气壮山河的建设浪潮，有波澜壮阔的改革探索，也有拥抱世界的________襟怀。在这条路上，我们用几十年时间，走完了发达国家几百年走过的发展历程；我们用一百年的奋斗，实现了中华民族伟大复兴中国梦的关键一步。",
        options: ["餐风宿露 开明", "筚路蓝缕 开放", "栉风沐雨 开朗", "艰苦卓绝 开拓"],
        answer: "B",
        explanation: "正确答案为：B（筚路蓝缕 开放）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 134,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题34（2021年北京市考）\n《中庸》不同于《大学》，后者________，对于核心概念的相互关系有明确规定；前者相对散漫，没有交代各个部分之间的逻辑联系，留下巨大的言说空间与理论张力。填入划横线部分最恰当的一项是：",
        options: ["纲举目张", "包罗万象", "字字珠玑", "条分缕析"],
        answer: "A",
        explanation: "正确答案为：A（纲举目张）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 135,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题35（2018年湖北选调）\n应对老龄化，化解养老难题，政府________。通常说来，这种责任更多地体现于足够的政策________，以此促进养老市场的发育和壮大。",
        options: ["责无旁贷 倾斜", "首当其冲 配套", "任重道远 制定", "义不容辞 导向"],
        answer: "A",
        explanation: "正确答案为：A（责无旁贷 倾斜）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 136,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题36（2020年山东省考）\n喜剧看似简单，其实最难把握________。表演太浮夸则________，表演太温吞则让喜剧失去光泽。有的人适合演小品、说相声，但并不一定适合演喜剧电影。",
        options: ["分寸 过犹不及", "标准 适得其反", "尺度 矫枉过正", "火候 画蛇添足"],
        answer: "A",
        explanation: "正确答案为：A（分寸 过犹不及）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 137,
        type: "single",
        category: "group2",
        categoryName: "第二组 (T19~T37)",
        question: "例题37（2019年河南选调）\n应该如何正确开展批评和自我批评呢？要无私无畏，敢于揭露问题。少数党员领导干部由于“老好人思想”作怪，在专题民主生活会上，往往选择对上级放“礼炮”，对同级放“哑炮”，对自己放“空炮”。三言两语听上去________，实际上________、毫无价值，不但不能推动工作、维护党内团结，而且还会放任同志身上错误的滋长。",
        options: ["春风化雨 无关痛痒", "和颜悦色 扬汤止沸", "和风细雨 隔靴搔痒", "洋洋盈耳 无足轻重"],
        answer: "C",
        explanation: "正确答案为：C（和风细雨 隔靴搔痒）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 138,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题38（2020年山东省考）\n网约车平台，理应承担管理和风险连带责任，并对造成的各类事故和损害优先承担赔付责任，这样才能让平台有从严管理的高度自觉，而不能以自己是第三方为借口________。填入划横线部分最恰当的一项是：",
        options: ["独善其身", "袖手旁观", "逃之夭夭", "置身事外"],
        answer: "D",
        explanation: "正确答案为：D（置身事外）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 139,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题39（2018年辽宁事业单位）\n城市的人居环境和城市发展要坚持发展和保护双赢、坚持当前发展和长远规划相结合：离开经济搞环境是________，而脱离环境搞发展则是________。",
        options: ["升山采珠 饮鸩止渴", "缘木求鱼 竭泽而渔", "刻舟求剑 杀鸡取卵", "南辕北辙 从长计议"],
        answer: "B",
        explanation: "正确答案为：B（缘木求鱼 竭泽而渔）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 140,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题40（2021年山东）\n促进技术创新、产业升级，实现经济高质量发展，离不开人才的________作用，但是，有的地方并没有认真思考自身实际条件对吸引人才、发挥人才积极作用的影响，恨不得引进一批人才后立刻就让当地经济社会发生翻天覆地的变化，在引进人才工作上出现________的问题。",
        options: ["引导 拔苗助长", "辅助 一拥而上", "支撑 急功近利", "推动 因噎废食"],
        answer: "C",
        explanation: "正确答案为：C（支撑 急功近利）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 141,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题41（2017年422联考）\n古典农业社会中，人的乡愁和城市没有太大的关系。彼时的乡愁大抵是怀才不遇的流荡，以及战争带来的________和乡土难返。而现在，大多数“乡愁感慨”是具有城市生活经历的人发出的，他们发愁的是城市“工作好不好找，房子买不买得起”等等，过去随时可以返回的家乡，正逐渐消失在城市化运动中。因此，他们对乡愁的________可能完全不是同一个方向，甚至可能是“城愁”。",
        options: ["背井离乡 认同", "流离失所 认识", "民不聊生 认可", "饥寒交迫 认知"],
        answer: "A",
        explanation: "正确答案为：A（背井离乡 认同）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 142,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题42（2019年四川选调）\n互联网新技术新应用对文化产业进行全方位、全角度、全产业链的改造，释放数字化对文化产业发展的放大、叠加和倍增作用，推动互联网、移动网与文化之间形成________的新形态。填入划横线部分最恰当的一项是：",
        options: ["唇齿相依", "休戚与共", "同舟共济", "水乳交融"],
        answer: "D",
        explanation: "正确答案为：D（水乳交融）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 143,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题43（2022年广东省考）\n党的百年历史，就是党与群众水乳交融、________的历史。一条扁担、一张借据、半条棉被就是党与人民血肉相连、情深似海的________。",
        options: ["休戚与共 见证", "唇齿相依 印记", "相濡以沫 记忆", "众志成城 证明"],
        answer: "A",
        explanation: "正确答案为：A（休戚与共 见证）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 144,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题44（2021年国考）\n一些国家在实现自身现代化过程中选错了参照系，将发达国家有什么、做什么作为实现自身现代化的________，导致在向市场经济转型过程中经济停滞、崩溃，危机不断。而中国能够根据自己的要素禀赋条件，发挥政府在市场经济中________的作用，把自己能做好的产业做大做强，将比较优势变成竞争优势，从而推动经济长期稳定快速发展。",
        options: ["目标 因势利导", "原则 总揽全局", "模本 穿针引线", "途径 保驾护航"],
        answer: "A",
        explanation: "正确答案为：A（目标 因势利导）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 145,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题45（2021年新疆区考）\n有这样一则通俗的比喻风力发电、光伏发电领域的弃风弃光，就像种菜。有些地方产量高，可本地吃不完，又没有足够的运力运出去，就只能白白丢掉可惜，却实属无奈，当然，个中原因必定更为复杂，但道理却相通——无论是弃菜还是弃风弃光。________。浪费的是资源。制约的是产业，影响的是信心。解决弃风弃光问题，工具箱内的工具很多，各地应根据实际情况算综合账________按需取用。",
        options: ["长此以往 因地制宜", "旷日持久 对症下药", "日积月累 随机应变", "经年累月 量体裁衣"],
        answer: "A",
        explanation: "正确答案为：A（长此以往 因地制宜）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 146,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题46（2023年国考）\n红树林的地下部分长期处于厌氧环境，减缓了根系和凋落物的分解速率，加速了碳埋藏速率。此外，红树林大多分布于沉积型海岸河口，由上游河流和海洋潮汐共同作用带来的大量外源性碳，被它们固定并快速沉积下来。这“________”的组合拳使得红树林成为海岸带蓝碳碳汇的主要贡献者。填入划横线部分最恰当的一项是：",
        options: ["取长补短", "标本兼治", "开源节流", "一举两得"],
        answer: "C",
        explanation: "正确答案为：C（开源节流）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 147,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题47（2023年联考）\n所有消费都应该建立在自己已有的经济基础之上，应该________消费、有所节制。与其被“花钱一时爽，还债三年光”的“伪精致”所累，真不如根据实际情况合理规划开支，务实购买必需品，________把日子过好。",
        options: ["量入为出 细水长流", "精打细算 细水长流", "量入为出 勤俭持家", "精打细算 勤俭持家"],
        answer: "A",
        explanation: "正确答案为：A（量入为出 细水长流）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 148,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题48（2021年国考）\n“人民城市人民建”。搭建民意“直通车”、公众“议事厅”，有事好商量，大家来出力，很多工作就能做到________。比如上海能在短短一年内迅速形成垃圾分类的新风尚，靠的就是人民群众的主动性、积极性与创造性。填入划横线部分最恰当的一项是：",
        options: ["立竿见影", "事半功倍", "万无一失", "尽善尽美"],
        answer: "B",
        explanation: "正确答案为：B（事半功倍）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 149,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题49（2018年国考）\n医疗改革方案将引导医疗机构、医务人员，通过提供更多更好的诊疗服务，获得________的补偿。对于过度治疗问题，该方案是一种________的做法，它让医生的收入与所开的药物、检查脱钩，让医疗工作者的劳动收入真正体现在明处。",
        options: ["合法 立竿见影", "公正 行之有效", "适度 一劳永逸", "合理 釜底抽薪"],
        answer: "D",
        explanation: "正确答案为：D（合理 釜底抽薪）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 150,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题50（2022年江苏）\n广大进城务工人员常常在医疗、社保、子女入学等涉及公共服务均等化的民生保障问题上面临________，这些都是摆在我们面前的现实问题。城镇化是一个渐进过程，很多问题的解决无法________，但至少应该在发展的过程中，努力体现解决问题的诚意。",
        options: ["挫折 迎刃而解", "窘境 一蹴而就", "劣势 急功近利", "困难 立竿见影"],
        answer: "B",
        explanation: "正确答案为：B（窘境 一蹴而就）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 151,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题51（2020年事业单位联考）\n进入“移动互联”时代，我们获取特定知识越来越容易。以往，需要在图书馆中找寻多日的研究资料，今天，借助移动互联，借助一些搜索工具，这些知识都可以随时随地，________。今天，重要的已经不再是掌握特定知识，而是具备较高的思维水平，而是对信息的重要性做出________，而是在各种可能的候选方案中快速做出自己的抉择。",
        options: ["信手拈来 判断", "触类旁通 评价", "手到擒来 选择", "唾手可得 解释"],
        answer: "A",
        explanation: "正确答案为：A（信手拈来 判断）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 152,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题52（2009年国考）\n柏克和阿伦特等思想家把博爱和同情视为感伤主义，是滥情、不理智的表现，认为结果会________，达不到改善弱者境遇的效果。贫困等问题的解决还是要靠政治，而非部分人的善心。填入划横线部分最恰当的一项是：",
        options: ["适得其反", "事与愿违", "南辕北辙", "雪上加霜"],
        answer: "B",
        explanation: "正确答案为：B（事与愿违）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 153,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题53（2022年湖北省考）\n党的十八大以来，习近平总书记始终________、以上率下，带头严格执行中央八项规定，以行动作无声的号令、以身教作执行的榜样，为全党改进作风提供了强大动力。从八项规定到八项规定实施细则，研究同样的内容并进一步深化细化，释放出________将作风建设进行到底的鲜明信号。",
        options: ["高瞻远瞩 一如既往", "以身作则 一以贯之", "克己奉公 久久为功", "身先士卒 驰而不息"],
        answer: "B",
        explanation: "正确答案为：B（以身作则 一以贯之）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 154,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题54（2010年国考）\n“器大者声必闳，志高者意必远。”新闻作品要想成为历史的“宏音”，时代的“响箭”，新闻记者就必须胸怀全局、________，深入________新闻的理性力量，使新闻语言具有一种理性美。",
        options: ["高瞻远瞩 分析", "高屋建瓴 发掘", "见微知著 彰显", "由表及里 剖析"],
        answer: "B",
        explanation: "正确答案为：B（高屋建瓴 发掘）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 155,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题55（2023年湖北事业单位）\n踏上向第二个百年奋斗目标进军的新征程，只要我们继续守好人民的心，就一定能派发起亿万人民________、勇毅前行的强大力量，谱写新时代中国特色社会主义更加绚丽的华章。填入划横线部分最恰当的一项是：",
        options: ["踔厉奋发", "勤力同心", "同舟共济", "团结奋进"],
        answer: "A",
        explanation: "正确答案为：A（踔厉奋发）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 156,
        type: "single",
        category: "group3",
        categoryName: "第三组 (T38~T56)",
        question: "例题56（2018年浙江选调）\n有人说，“安逸的日子，有时是一种腐蚀剂”。这话不无道理。远离了战火硝烟，有些人就会逐渐淡忘为国捐躯的________；过惯了衣食无忧的生活，有些人就会________、精神空虚。少数人曲解历史、恶搞先烈的行为，应引起全社会的警觉。",
        options: ["刚正不阿 趾高气扬", "大义凛然 忘乎所以", "永垂不朽 得意洋洋", "视死如归 不思进取"],
        answer: "B",
        explanation: "正确答案为：B（大义凛然 忘乎所以）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 157,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题57（2019年贵州选调）\n年轻干部要想行得端、走得正，就必须涵养道德操守，明礼诚信，特别是要敢于讲真话、讲实话，切忌开“空头支票”，________说好话、________说套话、________说大话、规避责任说假话。",
        options: ["曲意逢迎 心口不一 不切实际", "委曲求全 虚与委蛇 好高骛远", "阿谀奉承 独善其身 好大喜功", "投其所好 明哲保身 沽名钓誉"],
        answer: "D",
        explanation: "正确答案为：D（投其所好 明哲保身 沽名钓誉）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 158,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题58（2015年国考）\n发展经济并没有错，有效利用文化资源带动当地社会发展也是很好的尝试。但倘若不论真伪，抑或不顾文化自身的形态，________、强行落地，旅游未必能够发展起来，反而可能________。它所反映出来的，恰恰是对文化缺乏认识、对建设缺乏创新的“啃古”心态。",
        options: ["牵强附会 劳民伤财", "曲意逢迎 适得其反", "偷梁换柱 进退维谷", "附庸风雅 无所适从"],
        answer: "A",
        explanation: "正确答案为：A（牵强附会 劳民伤财）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 159,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题59（2019年天津事业编）\n①________是指为了装点个人的门面而结交社会文化名士，并积极主动地从事有关文化的活动。此词语不能误用作褒义。②________是指某种事物或行为结果比人预想的要好一些，基本上还算能够让人满意。③________指针对同一个问题，各个人因为观察、分析、认识的角度不同而导致见解也不相同。",
        options: ["附庸风雅 不如人意 仁者见仁", "舞文弄墨 不如人意 各抒己见", "附庸风雅 差强人意 仁者见仁", "舞文弄墨 差强人意 各抒己见"],
        answer: "C",
        explanation: "正确答案为：C（附庸风雅 差强人意 仁者见仁）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 160,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题60（2022年浙江省考）\n修炼挨批评这项基本功，要有虚心接受的气度。接受批评，就要拿出虚心以待、胸怀若谷的姿态，砥砺________、从善如流的自觉。填入划横线部分最恰当的一项是：",
        options: ["见贤思齐", "洗心革面", "兼听则明", "闻过则喜"],
        answer: "D",
        explanation: "正确答案为：D（闻过则喜）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 161,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题61（2022年河南省考）\n儿童多动症的注意力缺陷症状延续到成人期，表现为做事拖延，时间管理能力差，组织性差，效率低等；而儿童期的多动或冲动症状，也常常以“________”的形式表现出来，比如计划多却难以坚持，频繁辞职更换工作，情绪控制能力差等。填入划横线部分最恰当的一项是：",
        options: ["顾此失彼", "似是而非", "莫名其妙", "改头换面"],
        answer: "D",
        explanation: "正确答案为：D（改头换面）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 162,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题62（2022年浙江省考）\n在秦汉以后的中国古代社会，历代王朝的治理过程总是呈现出________的特征，不仅朝代之间政治经济政策迥异，即使是在同一朝代，也会因皇帝嗣位、权臣更迭等原因而________。",
        options: ["变幻无常 移风易俗", "福祸无常 翻云覆雨", "反复无常 改弦更张", "治忽无常 朝令夕改"],
        answer: "C",
        explanation: "正确答案为：C（反复无常 改弦更张）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 163,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题63（2021年浙江省考）\n竹被文人高士用来表现脱俗的情趣、正直的气节、虚心的品质，墨竹成了书、画、道的________，成了人格、人品的写照，寓意兴寄愈益丰厚，成为中国画史________的题材。",
        options: ["粘合剂 历久弥新", "代表作 独树一帜", "综合体 经久不衰", "标志物 引人注目"],
        answer: "C",
        explanation: "正确答案为：C（综合体 经久不衰）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 164,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题64（2017年联考）\n面对基层治理难题，当然不能因为利益的________而将其束之高阁，也不能因为情感的________而长期“一事一法”。否则，一些问题可能会________，失去改革的最佳“窗口期”，最终损害的还是群众的利益。",
        options: ["冲突 纠纷 积习难改", "牵扯 阻扰 根深蒂固", "羁绊 纠葛 积重难返", "束缚 阻隔 积习深重"],
        answer: "C",
        explanation: "正确答案为：C（羁绊 纠葛 积重难返）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 165,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题65（2020年下四川省考）\n当国大业大、兵强马壮的时候，非我莫属、称王称霸的心理优势不免同步膨胀，进而就会很自然地顺应起弱肉强食的丛林法则，对外扩张、威胁他国，成为________的思维惯性。而此时，属于文明的力道，才真正凸显出来。顺从欲望本能而为，________，那是动物天性的暴力遗存；依照价值观念而为，约束自我，才是人类文明的进步力量。",
        options: ["理所当然 顺其自然", "水到渠成 以暴制暴", "顺势而为 放任自流", "因势利导 随心所欲"],
        answer: "C",
        explanation: "正确答案为：C（顺势而为 放任自流）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 166,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题66（2021年联考）\n《周书》曰：“小满之日苦菜秀。”小满时节，麦类、谷物等农作物子粒开始饱满，但尚未成熟，恰是青黄不接的时候。而田间地头的野菜正蓬勃生长，采食野菜来度过饥荒，自是________。填入划横线部分最恰当的一项是：",
        options: ["不容置疑", "顺理成章", "水到渠成", "理所当然"],
        answer: "B",
        explanation: "正确答案为：B（顺理成章）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 167,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题67（2016年河北事业单位）\n上海发生的这起地铁事故，不仅给公共交通系统，也给其他公共服务行业敲响了安全警钟，值得所有涉及公共安全的行业和部门汲取借鉴，________，把事故消灭在萌芽状态。填入划横线部分最恰当的一项是：",
        options: ["未雨绸缪", "防微杜渐", "防患未然", "曲突徙薪"],
        answer: "B",
        explanation: "正确答案为：B（防微杜渐）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 168,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题68（2019年江西法检）\n①眼下强调防风险的重要性，并不是山雨欲来、仓促应战，而是________、防微杜渐。②要想在创新上赢得先机，就需要看准创新方向和领域，毫不犹豫、尽快启动、________、坚持不懈。",
        options: ["居安思危 趁热打铁", "未雨绸缪 一鼓作气", "有备无患 连成一气", "常备不懈 一气呵成"],
        answer: "B",
        explanation: "正确答案为：B（未雨绸缪 一鼓作气）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 169,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题69（2019年辽宁事业单位）\n我们从小就接受“无规矩不成方圆”的教育，明白世上任何事物皆有各自标准法度的道理。但总有人不守规则、________，个中道理值得深思。事实上，近年来有关漠视、违反、扭曲规则的事，________，小到闯红灯、高铁霸座等，大到违规用权、官员腐败等，无不________着破坏规则导致的种种危害和风险。",
        options: ["自以为是 层出不穷 突显", "随心所欲 比比皆是 显示", "不以为然 大行其道 显露", "各行其是 屡见不鲜 凸显"],
        answer: "D",
        explanation: "正确答案为：D（各行其是 屡见不鲜 凸显）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 170,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题70（2020年山东省考）\n历史研究的任务，不仅在于弄清每一件具体史实的原貌，更在于揭示隐藏在历史现象背后带有规律性的东西。忽视微观研究的宏观研究，只能是________，无法真正揭示历史发展的规律；忽视宏观研究的微观研究，又成了________，同样难以揭示历史演进的奥秘。",
        options: ["夸夸其谈 缘木求鱼", "纸上谈兵 舍本逐末", "空中楼阁 盲人摸象", "坐而论道 断章取义"],
        answer: "C",
        explanation: "正确答案为：C（空中楼阁 盲人摸象）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 171,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题71（2017年吉林省考）\n第二季《中国诗词大会》在春节期间播放，观众可以参与互动，实现合家欢的观赏效果。《中国诗词大会》不________，采用了紧张刺激的追逐赛、争霸赛等多维度比赛形式，摆脱了说教意味，把各个年龄段的观众吸引到电视机前。填入划横线部分最恰当的一项是：",
        options: ["纸上谈兵", "夸夸其谈", "徒托空言", "坐而论道"],
        answer: "D",
        explanation: "正确答案为：D（坐而论道）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 172,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题72（2019年黑龙江边境）\n国家级和省级博物馆往往建设完善，参观者________，甚至每天一早就出现排队的长龙；省级以下的公办博物馆则________。有的地方有充分的财政投入保障，博物馆拥有不错的硬件和软件设施，参观者的“回头率”较高；有的地方则缺乏对博物馆的投入，馆舍狭小老旧，展出品维护不当，专业讲解人员稀缺，导致博物馆________，可能连当地人都不知道博物馆的大门朝哪个方向开。",
        options: ["纷至沓来 参差不齐 无人问津", "络绎不绝 良莠不齐 门庭冷落", "川流不息 泥沙俱下 无足轻重", "比肩接踵 大相径庭 门可罗雀"],
        answer: "B",
        explanation: "正确答案为：B（络绎不绝 良莠不齐 门庭冷落）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 173,
        type: "single",
        category: "group4",
        categoryName: "第四组 (T57~T73)",
        question: "例题73（2018年黑龙江省考）\n当下，“网红食品”让一些美食爱好者________。然而，朋友圈里的美食宣传往往真假莫辨，“网红食品”利用朋友圈熟人关系、口碑传播的社交特性推销产品，甚至________营销公众号为其背书。",
        options: ["接踵而至 鼓动", "蜂拥而至 发起", "亦步亦趋 策动", "趋之若鹜 发动"],
        answer: "D",
        explanation: "正确答案为：D（趋之若鹜 发动）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 174,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题74（2023年上海市考）\n京剧与中医、武术、国画并称中国的“四大国粹”，半个世纪前，那些名角、“头牌”演出时，往往________，一票难求。而在当今，年轻一代往往对本土传统文化弃之如敝履，对带洋字的文化则________。",
        options: ["万人空巷 趋之若鹜", "洛阳纸贵 炙手可热", "门庭若市 众星拱月", "万头攒动 敬而远之"],
        answer: "A",
        explanation: "正确答案为：A（万人空巷 趋之若鹜）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 175,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题75（2016年四川省考）\n经历了数代学院派导演在艺术上的探索和产业化白手起家的拓荒，电影不再只是“声光电”的艺术形式，更开启了一个________的市场化运作的时代。众多资本的涌入，一方面创造出巨大的利益空间，另一方面也暴露出行业内部的“________”———创作者的良莠不齐，伴之以评论界的莫衷一是，网络世界的众说纷纭，可谓“乱哄哄你方唱罢我登场”，乱象频生。",
        options: ["波澜壮阔 鱼目混珠", "雄心勃勃 鱼龙混杂", "焕然一新 尔虞我诈", "意气风发 良莠不齐"],
        answer: "B",
        explanation: "正确答案为：B（雄心勃勃 鱼龙混杂）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 176,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题76（2018年辽宁省考）\n近年来每逢传统节日、西方节日，抑或是“双11、双12”等人造节日，都成为互联网商家炒作的卖点，成为那些足不出户的年轻网民“买买买”的“狂欢盛宴”。交易额的放量增长带来了快递业的繁荣发展。然而快递数激增、过度包装、违规包装造成的污染及危害愈发________；假货、仿冒品、残次品________，随之而来是一些消费者维权困难，因此加强网购平台监管责任迫在眉睫。",
        options: ["有目共睹 层出不穷", "引人关注 鱼目混珠", "引人注目 鱼龙混杂", "备受瞩目 以假乱真"],
        answer: "B",
        explanation: "正确答案为：B（引人关注 鱼目混珠）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 177,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题77（2021年新疆区考）\n一直以来，为偶像打榜、刷数据________，其背后除了粉丝的狂热之外，更有“大粉”们的引导和灰色产业链的助推。此前，“星缘”APP利用粉丝给“爱豆”刷流量的需求，疯狂牟利，不到一年吸金800余万元。填入划横线部分最恰当的一项是：",
        options: ["大张旗鼓", "大行其道", "风靡一时", "蔚然成风"],
        answer: "B",
        explanation: "正确答案为：B（大行其道）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 178,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题78（2017年联考）\n晚明江南的富裕，提供了附庸风雅的环境与条件，使得饮茶风尚引发了名牌效应。先是苏州虎丘茶风行，然后有大方和尚以虎丘制茶法在徽州松萝山制茶，造就了明末________的松萝茶。一旦成了名牌，人们追求时尚，________，商家就有了商机，争相仿制，价格也直线上升。",
        options: ["如雷贯耳 一掷千金", "闻名遐尔 如影随形", "声名鹊起 趋之若鹜", "风靡一时 蜂拥而至"],
        answer: "C",
        explanation: "正确答案为：C（声名鹊起 趋之若鹜）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 179,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题79（2023年国考）\n我们确立和坚持马克思主义在意识形态领域指导地位的根本制度，新时代党的创新理论________，社会主义核心价值观广泛传播，中华优秀传统文化得到创造性转化、创新性发展，文化事业日益繁荣，网络生态持续向好，意识形态领域形势发生________、根本性转变。",
        options: ["振聋发聩 历史性", "深入人心 全局性", "高屋建瓴 实质性", "硕果累累 显著性"],
        answer: "B",
        explanation: "正确答案为：B（深入人心 全局性）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 180,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题80（2021年广东选调）\n一些戏曲剧目是________的经典之作，深受群众喜爱。这既是因为其艺术价值高，更是因为其中蕴含着深沉的家国情怀，________着追求正义与美好的理想。",
        options: ["风靡一时 肩负", "交口称赞 怀揣", "喜闻乐见 秉持", "脍炙人口 承载"],
        answer: "D",
        explanation: "正确答案为：D（脍炙人口 承载）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 181,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题81（2019年国考）\n中国的传统文化中，“老”是一个褒义的字眼。一个年轻人处事得当，会被说老练、老成。但是进入互联网特别是移动互联网时代，这沿袭了数千年的观念，短短数十年________。年龄大、资历老逐渐不再是一种优势，有时反而成了学习新事物的一种________。",
        options: ["土崩瓦解 羁绊", "灰飞烟灭 累赘", "化为乌有 阻力", "分崩离析 弊端"],
        answer: "A",
        explanation: "正确答案为：A（土崩瓦解 羁绊）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 182,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题82（2022年事业单位联考）\n儿童文学不仅给孩子带来快乐，满足孩子的情感需求，还关乎心灵的________和人格的完善。“趣”是很高的美学范畴，不是说哈哈一笑之后，________。让孩子笑并不难，难的是传达一种理想的、有境界的“趣”。",
        options: ["纯净 云淡风轻", "净化 空无一物", "美化 烟消云散", "洗涤 别无长物"],
        answer: "B",
        explanation: "正确答案为：B（净化 空无一物）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 183,
        type: "multiple",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题83（2022年辽宁事业单位）\n抗艾滋药物服用起来通常有严格的时间间隔要求，这样才能让药物在血液中维持一定的浓度，阻止病毒的复制，一旦漏服，被药物压制的病毒就有可能________大量复制，甚至产生抗药性。填入划横线部分最恰当的一项是：",
        options: ["重起炉灶", "卷土重来", "死灰复燃", "东山再起"],
        answer: ["B", "C"],
        explanation: "正确答案为：B、C。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 184,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题84（2021年江苏省考）\n科学和艺术都追求普遍性和永恒性，追求“真”和“美”。关于普遍性和永恒性是________的，科学求“真”和艺术求“美”也无需赘言。科学追求的美主要是和谐之美和简洁之美。至于“艺术求真”，是艺术家通过自己的________把事物的本质揭示出来，这是“源于生活，高于生活”的艺术创作原则。",
        options: ["显而易见 体验", "不言自明 把握", "有目共睹 认知", "不言而喻 感悟"],
        answer: "D",
        explanation: "正确答案为：D（不言而喻 感悟）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 185,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题85（2012年山东省考）\n吴越历史舞台的中心在哪里，多年来一直是学者与公众共同关注的焦点。尽管古籍文献对此有所________，但是多________，有的虽言之凿凿却只是演义。",
        options: ["论证 浮光掠影", "涉及 穿凿附会", "记载 语焉不详", "描述 轻描淡写"],
        answer: "C",
        explanation: "正确答案为：C（记载 语焉不详）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 186,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题86（2018年广西选调）\n我们常说“科学是开放的”，不是“封闭的”，科学的开放性意味着它不是永恒真理，可能出错。可是现实生活中，有些人在科学研究中对科学错误________，一旦自己的科研成果遇到质疑就立刻将其________。这看似暂时化解了危机，其实禁锢了自身的发展。",
        options: ["讳莫如深 束之高阁", "噤若寒蝉 置之脑后", "避而不谈 改头换面", "谈虎色变 弃如敝屣"],
        answer: "A",
        explanation: "正确答案为：A（讳莫如深 束之高阁）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 187,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题87（2019年山东选调）\n我们党领导人民干革命、搞建设、抓改革，从来都是为了解决中国的现实问题。如果对矛盾________，甚至回避、掩饰矛盾，在矛盾面前畏缩不前，坐看矛盾恶性转化，那就会________，最后势必造成无法弥补的损失。",
        options: ["置若罔闻 亡羊补牢", "视而不见 尾大不掉", "闭目塞听 覆水难收", "熟视无睹 积重难返"],
        answer: "D",
        explanation: "正确答案为：D（熟视无睹 积重难返）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 188,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题88（2023年浙江省考）\n中华文化是一座浩瀚的思想库，里面有很多珍宝，但也不乏糟粕，不是所有的内容都可以复活于当代、贡献于世界。时代的变迁决定了我们不可能________保留传统文化的一切方面。中华文明有的内容可以超越时空，有的内容则已尘封；有的可以古为今用，有的则应________。",
        options: ["循规蹈矩 去粗取精", "如法炮制 弃若敝展", "固步自封 漠然置之", "原封不动 束之高阁"],
        answer: "D",
        explanation: "正确答案为：D（原封不动 束之高阁）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 189,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题89（2021年江苏省考）\n仔细观察自然是发现的开端，是认识事物奥秘的向导，我们要注意观察自然界的各种事物、各种现象，注意大自然偶然疏忽留下的破绽，通过对这些________的观察，追根寻源，让大自然________出各种深藏的秘密。我们要以大自然为师，以自然之道来认识自然、适应自然、调节自然、改造和利用自然，使得人类社会________，不断向前发展。",
        options: ["蛛丝马迹 袒露 日新月异", "细枝末节 显现 顺势而行", "精益求精 裸露 改天换地", "细致入微 尽显 弃旧图新"],
        answer: "A",
        explanation: "正确答案为：A（蛛丝马迹 袒露 日新月异）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 190,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题90（2015年广东省考）\n如今社会上“厌读”的情绪严重。由于不读书，导致一些人走上邪路。读者厌读固然有读者自身的问题。我们作者是不是也该________：为什么读者不爱书？是读者不赞成作者的观点吗？未必！既然赞成作者的观点就该同声相应，可读者为什么不来“应”呢？这就告诉我们：作者有个文风问题。再想一想：为什么别人的文章读者________，奔走相告。而我们的文章读者却________呢？这只能说明我们的文风确有问题。",
        options: ["扪心自问 爱不释手 不足挂齿", "自我反省 奉为至宝 嗤之以鼻", "反躬自问 手不释卷 不屑一顾", "不耻下问 爱不释手 鄙夷不屑"],
        answer: "C",
        explanation: "正确答案为：C（反躬自问 手不释卷 不屑一顾）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 191,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题91（2019年河南选调）\n说起分布式存储，大家可能都会觉得这是一个________的问题。虽然分布式存储并不是一个全新的技术，许多人也对它________。但它是一个涉及到文件系统、存储系统、网络、算法、管理等多方面技术的汇聚。因此，要想真正掌握分布式存储技术，绝不是一件轻松的事。",
        options: ["老生常谈 耳熟能详", "历久弥新 烂熟于心", "陈词滥调 轻车熟路", "流口常谈 驾轻就熟"],
        answer: "A",
        explanation: "正确答案为：A（老生常谈 耳熟能详）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 192,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题92（2017年四川）\n《题西林壁》《和子由渑池怀旧》是苏轼的哲理诗，其________的诗句如“不识庐山真面目，只缘身在此山中”和“人生到处知何似，应似飞鸿踏雪泥”等早已________于人们的日常生活中，成为表达思想和情感的生动话语。",
        options: ["脍炙人口 渗透", "口碑载道 渗入", "妇孺皆知 浸润", "家喻户晓 浸透"],
        answer: "A",
        explanation: "正确答案为：A（脍炙人口 渗透）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 193,
        type: "single",
        category: "group5",
        categoryName: "第五组 (T74~T93)",
        question: "例题93（2014年河北）\n①《四库全书》与《四库全书总目》________，构成一个巨大的研究空间，潜藏着重大的学术价值。②这个老头大冷的天还在早晨打着赤膊跑步，让人________。③一个时期以来，歌剧《图兰朵》的上演，成了许多人________的话题。",
        options: ["珠联璧合 匪夷所思 津津乐道", "交相辉映 不可思议 津津乐道", "交相辉映 匪夷所思 口口相传", "珠联璧合 不可思议 口口相传"],
        answer: "A",
        explanation: "正确答案为：A（珠联璧合 匪夷所思 津津乐道）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 194,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题94（2019年辽宁省考）\n显微摄影是一门使用照相机拍摄显微镜下一般用肉眼无法看清的标本的技术。肉眼中________的细沙，在显微镜下确是“一沙一世界”，有的________像宝石，有的金黄酥脆像饼干。即使是________的柴米油盐，在显微镜下也会展现神奇而充满美丽的一面。",
        options: ["如出一辙 晶莹剔透 不足为奇", "一成不变 玲珑剔透 不足为奇", "一模一样 光亮通明 司空见惯", "千篇一律 晶莹剔透 司空见惯"],
        answer: "D",
        explanation: "正确答案为：D（千篇一律 晶莹剔透 司空见惯）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 195,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题95（2013年国考）\n尽管诗歌绝无翻译的可能，却大有翻译介绍的必要。有多位前辈时贤对诗歌翻译理论不乏鞭辟入里的________。然而，何谓诗歌翻译的理想形式却________。",
        options: ["真知灼见 各执一端", "不刊之论 见仁见智", "不易之论 各持己见", "远见卓识 众说纷纭"],
        answer: "B",
        explanation: "正确答案为：B（不刊之论 见仁见智）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 196,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题96（2019年青海法检）\n形式主义人人喊打，但到底形式主义是什么、怎样克服形式主义，一些人却________。往往是以形式主义反对形式主义，这种不当________模式，必然导致基层治理空洞化、政策执行空白化、治理对象空心化。",
        options: ["众说纷纭 认知", "众口难调 运作", "指手画脚 应对", "莫衷一是 思维"],
        answer: "D",
        explanation: "正确答案为：D（莫衷一是 思维）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 197,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题97（2018年广西事业编）\n贺兰山岩画自发现以来，给人们的震撼和向人们提出的问题几乎同样多，有关岩画的内容、年限、创作族群等问题，专家们________，贺兰山岩画上空的这些谜团至今仍然烟云缭绕。考古界有句名言：“唯一能确定的就是不确定！”贺兰山岩画似乎________了这句话，岩画研究中的诸多观点都陷入了一种不可确定中。",
        options: ["唇枪舌剑 延伸", "莫衷一是 呼应", "不置可否 诠释", "各持己见 印证"],
        answer: "D",
        explanation: "正确答案为：D（各持己见 印证）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 198,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题98（2016年广东省考）\n一本好的社会学著作，不仅应该做到于无声处听惊雷，在琐屑的生活细节中________，而且应该让读者在阅读的过程中，情不自禁地借助作者的方法去检验生活和理解社会。填入划横线部分最恰当的一项是：",
        options: ["见微知著", "管中窥豹", "一叶知秋", "洞若观火"],
        answer: "A",
        explanation: "正确答案为：A（见微知著）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 199,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题99（2020年事业编联考）\n从可持续发展看，保护环境就是保护生产力，改善环境就是发展生产力。我们一定要树立大局观、长远观、整体观，不能________、急功近利。要坚持节约资源和保护环境的基本国策，推动形成绿色发展方式和生活方式，协同推进人民富裕、国家强盛、中国美丽，形成人与自然和谐发展的现代化建设新________。",
        options: ["寅吃卯粮 格局", "管窥蠡测 态势", "坐井观天 思路", "饮鸩止渴 方式"],
        answer: "A",
        explanation: "正确答案为：A（寅吃卯粮 格局）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 200,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题100（2020年深圳市考）\n（1）她对这些诗人诗作的解析，________，丝丝入扣，毫无牵强，读她的文章，就像是面对着那个活生生的诗人。（2）在边防工作站，我们见到了年轻的站长，他能用流利的外语与境外人员交谈，对境外的民族、文化等知识更是________。（3）他删除的用心是隐秘的、手法是细腻的，但是，在________的历史学家眼里，他所有暗中的手脚都无所遁形。",
        options: ["明察秋毫 洞若观火 了如指掌", "明察秋毫 了如指掌 洞若观火", "了如指掌 明察秋毫 洞若观火", "洞若观火 了如指掌 明察秋毫"],
        answer: "D",
        explanation: "正确答案为：D（洞若观火 了如指掌 明察秋毫）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 201,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题101（2019年四川事业单位）\n在市场经济中，营销各凭本事，________，________经营者不能舍本逐末，把精力全部用在包装和宣传上，而忽视产品质量，营销本领再大，也不能________产品本身的门槛。",
        options: ["情有可原 虽然 轻视", "无可非议 其实 忽略", "评头论足 刚好 不顾", "无可厚非 但是 无视"],
        answer: "D",
        explanation: "正确答案为：D（无可厚非 但是 无视）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 202,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题102（2022年深圳市考）\n（1）如果仅凭蜻蜓点水似的观感，作出以偏概全的判断，就容易盲人摸象、________难以读懂真实而鲜活的农村，甚至陷入悲观悲情的泥潭。（2）在中华民族近代史上，贫困如影随形：多灾多难，饿殍遍地的记录________。",
        options: ["目无全牛 俯拾皆是", "一叶障目 俯拾皆是", "目无全牛 不胜枚举", "一叶障目 不胜枚举"],
        answer: "D",
        explanation: "正确答案为：D（一叶障目 不胜枚举）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 203,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题103（2023年4月2日湖北省事业编）\n从________的诗词歌赋，到深邃厚重的经史子集，中华优秀传统文化是我们共同的精神家园。尽管欣赏古典之美不限人群，但理解古人哲思却存在“门槛”。悠远的历史，迥异的生活，古奥的文字，以及词句中的微言大义，都带来了理解上的困难。从这个意义上说，《中国诗词大会》《中国成语大会》等文化节目的热播，为初学者叩开了解传统文化的大门，而与千古圣哲神交，还需积年累月、________的努力。",
        options: ["汗牛充栋 千秋万代", "星罗密布 接连不断", "卷帙浩繁 此起彼伏", "浩如烟海 一以贯之"],
        answer: "D",
        explanation: "正确答案为：D（浩如烟海 一以贯之）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 204,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题104（2017年联考）\n沿着卢瓦尔河，法国的历史被书写进河谷里________的城堡群中。想要探寻几百年间法国乃至欧洲王宫贵胄间的权力斗争，窥视________的宫廷秘事，就要从走进这一座座城堡开始。",
        options: ["鳞次栉比 不可捉摸", "星罗棋布 波诡云谲", "浩如烟海 变幻莫测", "不计其数 变幻无常"],
        answer: "B",
        explanation: "正确答案为：B（星罗棋布 波诡云谲）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 205,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题105（2022年联考）\n关注受众、研究受众、服务受众，是互联网思维的一个鲜明特点。这与政治工作倡导以人为本的理念________。政治工作本质上是做人的工作，其实质就是一种受众至上的思维理念。填入划横线部分最恰当的一项是：",
        options: ["一脉相承", "相辅相成", "不谋而合", "并行不悖"],
        answer: "C",
        explanation: "正确答案为：C（不谋而合）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 206,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题106（2019年上海市考）\n当年刘邦入咸阳，“缓刑弛禁，以慰其望”，采取的是“有所不为”。后刘备入蜀，诸葛亮则“威之以法”“限之以爵”，采取的是“有所为”。“为”与“不为”________，都深得人心，实现大治，原因就在于________：秦朝苛政，百姓苦不堪言，不为而治，顺应人民的意愿；而蜀中刘璋长期暗弱，豪强专权自恣，必须严刑峻法。",
        options: ["异曲同工 度德量力", "殊途同归 审时度势", "背道而驰 实事求是", "见仁见智 量力而行"],
        answer: "B",
        explanation: "正确答案为：B（殊途同归 审时度势）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 207,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题107（2023年山东省考）\n著名画家阎立本画的《历代帝王图》是中国历史上帝王形象的标准范本。让人________的是，阎立本在画古代帝王像时，并没有任何范本依据，完全是凭借想象，画出来的人物形象自然跟历史人物________。当时的中国绘画理论中，“神似”的要求高于“形似”，因此在阎立本笔下的帝王外形________，只在表情气质上有差异。比如，开国君主往往神情威严，亡国之君却面目憔悴。",
        options: ["不解 判若两人 伯仲之间", "庆幸 天壤之别 丝毫不差", "可惜 泾渭分明 如出一辙", "遗憾 大相径庭 大同小异"],
        answer: "D",
        explanation: "正确答案为：D（遗憾 大相径庭 大同小异）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 208,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题108（2017年422联考）\n孔雀蜘蛛的体型非常小，只有4毫米到5毫米，其中，雌性蜘蛛比雄性蜘蛛大。不过，就是这样小的身躯，也能靠着大自然的________吸引人们的注意。填入划横线部分最恰当的一项是：",
        options: ["鬼斧神工", "精雕细刻", "巧夺天工", "匠心独运"],
        answer: "A",
        explanation: "正确答案为：A（鬼斧神工）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 209,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题109（2018年贵州省选调）\n宋代真是大发宏愿的时代，绘画写实技巧________，无论花鸟还是山水，与自然物象________。恰恰宋代又是我国古代科技发展的高峰，双峰并峙，正是“图像证史”一展身手的大舞台。",
        options: ["炉火纯青 不分轩轾", "目无全牛 不分畛域", "登堂入室 不谋而同", "登峰造极 不爽毫厘"],
        answer: "D",
        explanation: "正确答案为：D（登峰造极 不爽毫厘）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 210,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题110（2024年福建）\n在________唐代诗人进入戏曲作品时，赫赫有名的诗人如李白、杜甫等有幸借助戏曲艺术被不断演绎、重写，形成了________的唐代诗人题材戏曲作品。",
        options: ["援用 蔚然成风", "援引 蔚为大观", "采用 美轮美奂", "引述 叹为观止"],
        answer: "B",
        explanation: "正确答案为：B（援引 蔚为大观）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 211,
        type: "single",
        category: "group6",
        categoryName: "第六组 (T94~T111)",
        question: "例题111（2021年全国）\n武侠精神是中华民族传统文化的宝贵财富，也是伴随着“功夫”走向世界的________的中华文化符号。无论“兼济天下”的入世情怀，“士不可不弘毅”的责任担当，还是“诗酒年华、仗剑天涯”的洒脱性格，都吸引着一代又一代的年轻人________。正因此，充分折射这些精神的金庸小说才会________，引领了二十世纪八九十年代万人空巷的武侠热，也引领了前些年武侠题材翻拍剧的创作热潮。",
        options: ["鲜明 心向往之 长盛不衰", "典型 魂牵梦绕 方兴未艾", "独特 前赴后继 家喻户晓", "生动 孜孜以求 炙手可热"],
        answer: "A",
        explanation: "正确答案为：A（鲜明 心向往之 长盛不衰）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 212,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题112（2022年江苏省考）\n作者以文学实录的形式写下的山民故事和个人感悟，________，情深意切。有的考证源流，有的用诗词歌赋表达山川秀美、古迹悠悠，有的记录________花海的一头幸福猪、古镇休憩中的一条藏獒，幽默之处常常引得读者________，有的讲述古城的故人故事，有的怀念家人朋友，感人至深。",
        options: ["娓娓道来 徜徉 会心一笑", "滔滔不绝 徘徊 拍手叫好", "从容不迫 寄身 抚掌大笑", "侃侃而谈 闯入 忍俊不禁"],
        answer: "A",
        explanation: "正确答案为：A（娓娓道来 徜徉 会心一笑）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 213,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题113（2020年深圳市考）\n陈寅恪讲课，从不________。他曾言：“前人讲过的，我不讲；近人讲过的，我不讲；外国人讲过的，我不讲；我自己过去讲过的，也不讲。现在只讲未曾有人讲过的。”因而，陈寅恪上课的教室，总是坐得满满的。填入划横线部分最恰当的一项是：",
        options: ["拾人牙慧", "人云亦云", "步人后尘", "随波逐流"],
        answer: "A",
        explanation: "正确答案为：A（拾人牙慧）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 214,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题114（2017年天津选调）\n①这一场戏真演得________，赢得了满场观众的喝彩。②王大伯________地讲起了当年打鬼子的故事，我们都听得入迷了。③小说通过典型的语言描写，把几个有着不同性格特点的妇女形象________地展现在读者面前。④他擅长京剧，模拟各派唱腔，无不________。",
        options: ["绘声绘色 有声有色 惟妙惟肖 活灵活现", "活灵活现 绘声绘色 有声有色 惟妙惟肖", "有声有色 惟妙惟肖 绘声绘色 活灵活现", "有声有色 绘声绘色 活灵活现 惟妙惟肖"],
        answer: "D",
        explanation: "正确答案为：D（有声有色 绘声绘色 活灵活现 惟妙惟肖）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 215,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题115（2014年四川）\n唐朝社会的各色人物在唐朝文人笔下________，活灵活现。世界名著中有著名的四大吝啬鬼形象，即阿巴贡、泼留希金、夏洛克和葛朗台，而唐朝文人笔下的吝啬和贪婪之人亦________，这些生活在社会各阶层的人，被唐代文人刻画得________，读来呼之欲出，令人不禁莞尔。依次填入划横线处最恰当的一项：",
        options: ["惟妙惟肖 不相上下 绘声绘色", "跃然纸上 大相径庭 酣畅淋漓", "栩栩如生 毫不逊色 入木三分", "引人入胜 风格各异 活灵活现"],
        answer: "C",
        explanation: "正确答案为：C（栩栩如生 毫不逊色 入木三分）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 216,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题116（2021年福建事业单位）\n海鲜夜排档里往往________，夹杂着锅碗瓢勺的叮当声，油锅溅出刺啦声。桌上是清一色的舟山海鲜，鲜嫩香糯，清香四溢。游客从天南海北云集于此，笑声喧哗，________，确是别有一番滋味。梭子蟹上市的季节，更是热闹非常，杭州，宁波等地的人们会驱车几百里，专程跑来品尝地道的梭子蟹，一拨又一拨的客人，让摊主________。为了能吃上一口鲜香美味的梭子蟹，一些人不怕在摊边耐心地排队静候。",
        options: ["沸沸扬扬 食前方丈 美不胜收", "人声鼎沸 大快朵颐 应接不暇", "满城风云 大饱口福 目不暇接", "沸反盈天 狼吞虎咽 席不暇暖"],
        answer: "B",
        explanation: "正确答案为：B（人声鼎沸 大快朵颐 应接不暇）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 217,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题117（2015年江苏）\n夜色渐浓，江风徐徐，在灯火通明的街道上，叫卖声________，人们抛开白日里水泥森林的高压与冷漠，________在人流摩肩接踵的繁华小巷，百年老城的夜生活，就在________的夜晚中拉开了序幕。",
        options: ["不绝于耳 徘徊 欢声笑语", "此起彼落 穿梭 杂乱无序", "此起彼伏 流连 熙熙攘攘", "声声入耳 漫步 喧嚣不已"],
        answer: "C",
        explanation: "正确答案为：C（此起彼伏 流连 熙熙攘攘）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 218,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题118（2023年国考）\n相比于其他全球卫星导航系统采取单一轨道星座构型，北斗系统________，坚定选择了混合星座的特色发展之路，并首创短文通报模式，开创了通信导航一体化的独特服务模式，信息发送能力从一次120个汉字提升到一次1200个汉字，遇到突发情况时无需________，足以将情节一次性说清楚。依次填入画横线部分最恰当的一项是：",
        options: ["与众不同 言简意赅", "独树一帜 字斟句酌", "遥遥领先 删繁就简", "迎难而上 惜墨如金"],
        answer: "B",
        explanation: "正确答案为：B（独树一帜 字斟句酌）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 219,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题119（2021年浙江省考）\n这本书没有________的生涩文字，也没有________的说教辞令。全书朴实无华却字字珠玑，将家训家教中的为人处世道理细细道来，如春风化雨般启迪心智。依次填入画横线部分最恰当的一项是：",
        options: ["佶屈聱牙；夸夸其谈", "言之无物；空洞无物", "言过其实；一板一眼", "咬文嚼字；盛气凌人"],
        answer: "A",
        explanation: "正确答案为：A（佶屈聱牙；夸夸其谈）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 220,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题120（2023年辽宁）\n粤菜中有一个说法，叫“嫩而不生，仅熟即可”，这要求厨师对每一种食材的品性________，炒制的过程要眼疾手快，________，绝不能拖泥带水，只有这样，才能最大限度地________食材的鲜味。依次填入画横线部分最恰当的一项是：",
        options: ["如数家珍 一马当先 捕获", "了如指掌 一气呵成 挽留", "心领神会 一鼓作气 发挥", "心中有数 一以贯之 保存"],
        answer: "B",
        explanation: "正确答案为：B（了如指掌 一气呵成 挽留）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 221,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题121（2020年云南省考）\n曹雪芹通过贾府的衣食住行把________人家的富贵之相刻画得淋漓尽致。一屋一室，或雕梁画栋，或________，或金碧辉煌，或简约古朴，相映成辉，相映成画；一餐一饮精烹细作，食不厌精；________，雀衣彩绣，美轮美奂。但仍然没有宴席上的浅斟深酌更能体现出贾府“鲜花着锦、烈火烹油”之盛；没有比推杯换盏之时的琴歌酒赋更能体现出翰墨书香之族的风流雅致。",
        options: ["筚门圭窦 岸芷汀兰 一裙一裳", "兰艾同焚 粉墙黛瓦 一丝一缕", "钟鸣鼎食 曲径通幽 一衣一带", "桑枢瓮牖 小桥流水 一鞋一袜"],
        answer: "C",
        explanation: "正确答案为：C（钟鸣鼎食 曲径通幽 一衣一带）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 222,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题122（2015年贵州省考）\n求学者如果孜孜于衣食居住的安适，一定谈不上好学。同样，好学的目的也不是为了________，心灵之养甚于居养之安。学习的目的是成为“有道”之人，名闻利养并非先务。这不是________物质，而是强调学习就是学习，不要附带上物质目的。",
        options: ["养尊处优 否定", "丰衣足食 摈斥", "锦衣玉食 排斥", "肥马轻裘 抵触"],
        answer: "C",
        explanation: "正确答案为：C（锦衣玉食 排斥）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 223,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题123（2020年江苏事业单位）\n中国传统智慧告诉我们，一个人在适当的条件下可以积极进取、自强不息；面对生活的困境又应当具有抱朴守拙、________的胸襟和能力，而对四时变迁，中国人更是有一种________自然节律的意识，注意保健且依时而动。",
        options: ["安如泰山 遵循", "安身立命 跟随", "安贫乐道 顺应", "安之若素 服从"],
        answer: "C",
        explanation: "正确答案为：C（安贫乐道 顺应）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 224,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题124（2019年辽宁省）\n面对新生事物，在很多时候我们是________的。但是，纵观当前互联网经济的侵权新现象，如退押金难等，其所直陈的仍然是经济中存在的诚信缺失、假冒伪劣等老问题。因为互联网经济与实体经济一样，________着相同的市场交易规律，它的本质特征依然是信用经济。",
        options: ["无所适从 遵从", "茫然若失 遵守", "不知所措 遵照", "手足无措 遵循"],
        answer: "D",
        explanation: "正确答案为：D（手足无措 遵循）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 225,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题125（2019年四川选调）\n在“路见危难，伸出援手”日益稀缺，公众又普遍缺乏急救知识的现实语境下，________质疑救人者的专业能力与救人方式，既会挫伤救人者的积极性，也会让其他人因为救人之外的风险而________。相比于救治的精确性，保护好人环境的缺失，才是亟待解决的问题。",
        options: ["屡屡 噤若寒蝉", "无理 畏首畏尾", "随意 投鼠忌器", "反复 谈虎色变"],
        answer: "C",
        explanation: "正确答案为：C（随意 投鼠忌器）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 226,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题126（2019年江苏事业单位）\n疫苗挽救了不计其数的生命，天花基本绝迹，脊髓灰质炎几近被征服，破伤风和狂犬病也不再让人________。然而，公众对疫苗接种的不信任仍日益增加。国家和政府层面要严格立法、严格审核、严厉惩罚，企业更要自律自查。只有________，才能尽快打消民众心中的“疫苗恐慌”。依次填入画横线部分最恰当的一项是：",
        options: ["避之不及 严惩不贷", "谈虎色变 多管齐下", "望而生畏 标本兼治", "讳莫如深 正本清源"],
        answer: "B",
        explanation: "正确答案为：B（谈虎色变 多管齐下）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 227,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题127（2012年广州）\n一场激烈紧张的围棋赛事结束了，选手张行以微弱优势险胜对手，赛后面对媒体的采访时，张行________道：“好险好险，赢得真不容易。”填入划横线部分最恰当的一项是：",
        options: ["弹冠相庆", "举杯相庆", "额手称庆", "扶手称颂"],
        answer: "C",
        explanation: "正确答案为：C（额手称庆）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 228,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题128（2020年浙江）\n在媒体市场竞争中，________是整个市场正常有序运行的根本法则。新媒体凭借超越时空的非线性传播特性、跨边界的国际传播影响力成为新时代的________。可以说，谁掌握了新媒体，谁就走在了市场的前面。",
        options: ["与时俱进 骄子", "推陈出新 潮流", "优胜劣汰 宠儿", "弱肉强食 利器"],
        answer: "B",
        explanation: "正确答案为：B（推陈出新 潮流）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 229,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题129（2015年425联考）\n在如今浅阅读盛行的时代，一边是快餐式、碎片式阅读的轻松，一边是慢读、细读的沉重，经典自然免不了有点________的味道。就阅读是一种学习、一种对自我的提升而言，浅阅读并不是真正的阅读，长久沉浸在浅阅读的习惯之中，也只会让人离那些最好的书籍愈来愈远。然而，只是________对经典的珍重，却不如对于经典真实的理解更为重要。",
        options: ["阳春白雪 提倡", "曲高和寡 呼唤", "孤芳自赏 强调", "凄风苦雨 苛求"],
        answer: "B",
        explanation: "正确答案为：B（曲高和寡 呼唤）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 230,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题130（2019年江苏）\n科学的发展和进步往往________于科学假说，科学理论发展的历史就是假说的形成、发展和假说之间的竞争、更迭的历史。面对茫茫人类历史源头，面对________、虚虚实实的人类文明历史遗存，科学假说同样至关重要。他________地将历史、文化、人性、环境视角的“聚光灯”汇集在一起，形成了属于他的一盏“无影灯”，并以这样的视角照射幽暗的历史深处，从而解析出一些可能接近历史本源的朦胧真相。",
        options: ["发轫 凤毛麟角 含英咀华", "肇始 吉光片羽 独辟蹊径", "滥觞 汗牛充栋 苦心孤诣", "开端 如火如荼 毛举细故"],
        answer: "D",
        explanation: "正确答案为：D（开端 如火如荼 毛举细故）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 231,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题131（2017年湖南）\n所谓类文本，指的是出版物中所有作者文字之外的部分。尽管类文本也是阅读对象，但它们________地成为阅读的主体，甚至造成了对于文本的阅读________，实在有________之嫌。",
        options: ["反客为主 困难 以一持万", "主客颠倒 妨碍 舍本逐末", "太阿倒持 艰难 轻重倒置", "喧宾夺主 障碍 本末倒置"],
        answer: "B",
        explanation: "正确答案为：B（主客颠倒 妨碍 舍本逐末）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 232,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题132（2019年全国）\n古人根据经验编制了许多脍炙人口的农谚，比如“清明前后，种瓜点豆”。不仅是农谚，与二十四节气相关的诗词歌赋也是________，比如“蒹葭苍苍，白露为霜”，再比如“清明时节雨纷纷，路上行人欲断魂”。这些诗词歌赋________，将二十四节气与天气现象巧妙地结合在一起，具有很好的传播性。",
        options: ["俯拾皆是 沉思翰藻", "不胜枚举 形神兼备", "不计其数 文采斐然", "举不胜举 缀玉联珠"],
        answer: "C",
        explanation: "正确答案为：C（不计其数 文采斐然）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      },
{
        id: 233,
        type: "single",
        category: "group7",
        categoryName: "第七组 (T112~T134)",
        question: "例题133（2019年全国）\n云南在西、巴蜀在北，贵州有着说不尽的历史。这片西南中国的广袤土地，呈现了华夏山河的________、见证了中国革命的风云际会、记录了多民族文化的交流激荡。现在，贵州正在以绿色发展谋求生态红利，率先推进了中国生态文明建设的地方探索。填入划横线部分最恰当的一项是：",
        options: ["海晏河清", "渊渟岳峙", "钟灵毓秀", "瑕瑜互见"],
        answer: "A",
        explanation: "正确答案为：A（海晏河清）。【考点剖析】本题考查言语理解中高频成语的语境辨析与词义对立。请结合花生十三系统班700词讲义中对应的成语组群释义和经典例句进行温故知新。"
      }
    ]
  }
};
