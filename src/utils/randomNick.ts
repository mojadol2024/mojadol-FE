export const generateRandomNickname = (): string => {
    const adjectives = [
        '쫄깃한', '바삭한', '촉촉한', '빠른', '느린', '강력한', '약한', '은밀한', '우아한', '멋진',
        '훌륭한', '화려한', '고요한', '잔잔한', '활기찬', '대담한', '용감한', '즐거운', '신비로운', '매혹적인',
        '화난', '기쁜', '슬픈', '놀라운', '재미있는', '행복한', '친절한', '까칠한', '따뜻한', '차가운',
        '축축한', '건조한', '시원한', '따끈한', '굳센', '유연한', '단단한', '부드러운', '선명한', '흐릿한',
        '사랑스러운', '미운', '커다란', '작은', '거대한', '아담한', '아름다운', '추한', '귀여운', '무서운',
        '심플한', '복잡한', '재빠른', '느긋한', '총명한', '어리석은', '똑똑한', '우둔한', '재치있는', '냉정한',
        '활달한', '소심한', '용의주도한', '덜렁대는', '애교있는', '시크한', '호탕한', '우아한', '적극적인', '소극적인',
        '달콤한', '씁쓸한', '짭짤한', '매운', '시원한', '따뜻한', '아픈', '건강한', '지친', '상쾌한',
        '풍부한', '가난한', '부유한', '깨끗한', '더러운', '빛나는', '어두운', '선한', '악한', '명랑한',
        '잔혹한', '열정적인', '침착한', '혼란스러운', '차분한', '강렬한', '격렬한', '섬세한', '분노한', '지혜로운',
        '자유로운', '위풍당당한', '조용한', '비밀스러운', '영리한', '비겁한', '단호한', '과감한', '능숙한', '천천히',
        '기막힌', '신속한', '화끈한', '독특한', '심오한', '상냥한', '도전적인', '자연스러운', '위대한', '감동적인'
    ];

    const nouns = [
        '망토', '사자', '호랑이', '늑대', '여우', '곰', '토끼', '다람쥐', '고양이', '강아지',
        '펭귄', '고래', '상어', '물개', '돌고래', '독수리', '참새', '비둘기', '앵무새', '공작',
        '독거미', '잠자리', '꿀벌', '나비', '반딧불이', '장수풍뎅이', '사슴벌레', '메뚜기', '개구리', '뱀',
        '용', '유니콘', '도깨비', '요정', '마녀', '도적', '기사', '왕', '여왕', '황제',
        '마법사', '신', '괴물', '귀신', '유령', '좀비', '뱀파이어', '괴도', '탐정', '요리사',
        '농부', '사냥꾼', '대장장이', '상인', '연금술사', '대장', '선장', '해적', '왕자', '공주',
        '광대', '화가', '음악가', '작곡가', '가수', '춤꾼', '연주자', '작가', '시인', '철학자',
        '과학자', '의사', '간호사', '마부', '어부', '장군', '영웅', '모험가', '탐험가', '수호자',
        '관리자', '감시자', '보호자', '수호천사', '지배자', '길잡이', '현자', '천재', '바보', '기인',
        '수호신', '천사', '악마', '탐구자', '개척자', '견습생', '달인', '연구원', '탐사자', '전사',
        '상상가', '창조자', '지휘자', '조각가', '재판관', '의장', '사서', '요술사', '방랑자', '경비병',
        '버섯', '나무', '폭풍', '해바라기', '장미', '카멜레온', '거북이', '코뿔소', '기린', '불사조',
        '전갈', '라쿤', '미어캣', '캥거루', '코알라', '수달', '불곰', '늑대인간', '정령', '고블린',
        '스핑크스', '드래곤', '황금사과', '다이아몬드', '사파이어', '에메랄드', '수정', '해골', '피리', '북',
        '검', '방패', '투구', '갑옷', '창', '활', '지팡이', '마법봉', '수정구슬', '부엉이',
        '낙타', '도마뱀', '두더지', '코끼리', '불새', '흑기사', '백기사', '돌', '모래시계', '불꽃'
    ];

    const getRandomItem = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)];

    const adjective = getRandomItem(adjectives);
    const noun = getRandomItem(nouns);
    const randomNumber = Math.floor(1000 + Math.random() * 9000).toString(); // 1000~9999 사이 숫자 생성

    return `${adjective}${noun}${randomNumber}`;
};
