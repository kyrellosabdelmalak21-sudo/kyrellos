document.addEventListener("DOMContentLoaded", function () {
    // لو صورة اللوجو (download.jpg) مش موجودة، استبدلها بأيقونة ميزان بدل ما تظهر مكسورة
    document.querySelectorAll("img.office-logo").forEach(function (img) {
        img.addEventListener("error", function () {
            const fallback = document.createElement("div");
            fallback.className = img.className.replace("object-cover", "") + " bg-legalGold/10 flex items-center justify-center text-legalGold";
            fallback.innerHTML = '<i class="fa-solid fa-scale-balanced"></i>';
            img.replaceWith(fallback);
        }, { once: true });
    });

    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", function () {
            mobileMenu.classList.toggle("hidden");
        });
    }

    const chatToggleBtn = document.getElementById("chatbot-toggle-btn");
    const chatWindow = document.getElementById("chatbot-window");
    const chatCloseBtn = document.getElementById("chatbot-close-btn");
    const chatMessages = document.getElementById("chatbot-messages");

    if (chatToggleBtn && chatWindow) {
        chatToggleBtn.addEventListener("click", function () {
            chatWindow.classList.toggle("hidden");
        });
    }

    if (chatCloseBtn && chatWindow) {
        chatCloseBtn.addEventListener("click", function () {
            chatWindow.classList.add("hidden");
        });
    }

    // الردود الجاهزة لكل سؤال من أزرار الاختيار السريع
    const botResponses = {
        "مواعيد العمل": "مواعيد العمل الرسمية بالمكتب تبدأ من الأحد إلى الخميس، من الساعة 10 صباحاً وحتى 6 مساءً.",
        "الأسعار": "الأسعار والأتعاب تُحدد بدقة على حسب نوع القضية (مدنية، جنائية، أسرة، أو صياغة عقود) وتعقيداتها القانونية. تقدر تتواصل معنا واتساب عشان نديك تقدير دقيق لقضيتك.",
        "إزاي أحجز": "يمكنك حجز موعدك فوراً بالضغط على زر 'احجز موعد الان' الموجود في قسم حجز المواعيد، هيوديك لتقويم المكتب تختار فيه الوقت المناسب.",
        "العنوان فين": "مكتبنا يقع في جمهورية مصر العربية، ونقدم خدماتنا للموكلين داخل وخارج مصر. لمعرفة العنوان التفصيلي تواصل معنا واتساب وهنرسله لك فورًا.",
        "مكان المكتب": "مكتبنا يقع في جمهورية مصر العربية، ونقدم خدماتنا للموكلين داخل وخارج مصر. لمعرفة العنوان التفصيلي تواصل معنا واتساب وهنرسله لك فورًا.",
        "الاستشارات أونلاين": "نعم، تتوافر خدمة الاستشارات القانونية عبر تطبيق زوم للموكلين من خارج مصر بالتنسيق المسبق.",
        "تواصل واتساب": "يمكنك التواصل معنا فوراً ومراسلتنا عبر الواتساب من خلال الرقم: +201271737055"
    };

    // كلمات مفتاحية بيدور عليها البوت في أي سؤال حر يكتبه العميل
    const keywordMap = [
        { keywords: ["موعد العمل", "مواعيد العمل", "الدوام", "فاضي", "متاح", "شغال امتى", "المكتب مفتوح", "بتفتحوا امتى"], answer: "مواعيد العمل" },
        { keywords: ["سعر", "الأسعار", "اتعاب", "الأتعاب", "تكلفة", "فلوس", "كام", "بكام"], answer: "الأسعار" },
        { keywords: ["احجز", "أحجز", "حجز", "ميعاد", "موعد استشارة", "عايز اجي"], answer: "إزاي أحجز" },
        { keywords: ["عنوان", "فين المكتب", "فين مكانكم", "لوكيشن", "location", "وين المكتب"], answer: "العنوان فين" },
        { keywords: ["مكان", "الموقع", "عندكم فين"], answer: "مكان المكتب" },
        { keywords: ["اونلاين", "أونلاين", "زوم", "خارج مصر", "عن بعد", "مش هقدر اجي"], answer: "الاستشارات أونلاين" },
        { keywords: ["واتساب", "whatsapp", "رقم", "تليفون", "اتصال", "رقمكم"], answer: "تواصل واتساب" },
        { keywords: ["سلام", "السلام عليكم", "اهلا", "أهلا", "هاي", "مرحبا"], answer: null, direct: "أهلاً بيك! تقدر تسألني عن مواعيد العمل، الأسعار، العنوان، أو إزاي تحجز، أو دوس على أي زرار تحت." },
        { keywords: ["شكرا", "شكراً", "تمام", "ok", "تسلم"], answer: null, direct: "العفو! احنا تحت أمرك في أي وقت 🌟 تقدر تحجز موعدك من زرار 'احجز موعد الان'." }
    ];

    function findBotReply(userText) {
        const trimmed = userText.trim();
        const normalized = trimmed.toLowerCase();

        if (botResponses[trimmed]) {
            return botResponses[trimmed];
        }

        for (const entry of keywordMap) {
            for (const kw of entry.keywords) {
                if (normalized.includes(kw.toLowerCase())) {
                    return entry.direct || botResponses[entry.answer];
                }
            }
        }

        return "عذراً، مش فاهم سؤالك بالظبط 🙏 جرب تسأل عن (مواعيد العمل / الأسعار / إزاي أحجز / العنوان)، أو تواصل معنا مباشرة عبر الواتساب لأي استفسار.";
    }

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    function appendMessage(text, sender) {
        const messageDiv = document.createElement("div");
        const safeText = escapeHtml(text);

        if (sender === "user") {
            messageDiv.className = "flex items-start gap-2 justify-end";
            messageDiv.innerHTML = `
                <div class="bg-legalDark text-white p-3 rounded-2xl rounded-tl-none shadow-sm max-w-[80%] leading-relaxed">${safeText}</div>
                <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center font-bold text-xs shrink-0">أنت</div>
            `;
        } else {
            messageDiv.className = "flex items-start gap-2";
            messageDiv.innerHTML = `
                <div class="w-8 h-8 rounded-full bg-legalGold text-legalDark flex items-center justify-center font-bold text-xs shrink-0">بووت</div>
                <div class="bg-white p-3 rounded-2xl rounded-tr-none shadow-sm border border-gray-200 text-gray-800 max-w-[80%] leading-relaxed">${safeText}</div>
            `;
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    document.querySelectorAll(".chatbot-quick-btn").forEach(button => {
        button.addEventListener("click", function () {
            const questionText = this.getAttribute("data-question");

            appendMessage(questionText, "user");

            setTimeout(() => {
                appendMessage(findBotReply(questionText), "bot");
            }, 400);
        });
    });

    const chatTextInput = document.getElementById("chatbot-text-input");
    const chatSendBtn = document.getElementById("chatbot-send-btn");

    function sendUserMessage() {
        if (!chatTextInput) return;
        const text = chatTextInput.value.trim();
        if (text === "") return;

        appendMessage(text, "user");
        chatTextInput.value = "";

        setTimeout(() => {
            appendMessage(findBotReply(text), "bot");
        }, 400);
    }

    if (chatSendBtn) {
        chatSendBtn.addEventListener("click", sendUserMessage);
    }

    if (chatTextInput) {
        chatTextInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                e.preventDefault();
                sendUserMessage();
            }
        });
    }
});