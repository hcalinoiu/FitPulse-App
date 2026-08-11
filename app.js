const STORAGE_KEY = "fitpulse-state-v1";
const ACCOUNTS_KEY = "fitpulse-accounts-v1";
const SUPABASE_URL = "https://tfetdwjqlvkrqohuvriu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_IHiIEZPjl2yY_w8aNsgbPA_KXDeu1DO";
const APP_URL = "https://fitpulse-gym-app.hcalinoiu.chatgpt.site/";
const { createClient } = window.supabase;
const PLAN_LIMITS = {
  free: { label: "Free" },
  plus: { label: "Plus" },
  pro: { label: "Pro" },
};
const DEVELOPER_EMAILS = new Set(["hcalinoiu@gmail.com"]);
const FEATURE_PLANS = {
  challenge: "plus",
  achievements: "plus",
  progressYear: "plus",
  volume: "plus",
  subscriptionReport: "plus",
  activeWorkout: "pro",
  records: "pro",
  muscleMap: "pro",
  progressPhotos: "pro",
};
const PAYMENT_LINKS = {
  plus: "https://buy.stripe.com/test_00waEZ9YG10qcMqehR4F201",
  pro: "https://buy.stripe.com/test_bJeeVfdaS8sS3bQb5F4F200",
};
const STRIPE_CHECKOUT_FUNCTION = "stripe-checkout";
const MAX_PROGRESS_PHOTO_SIZE = 1100;
const PROGRESS_PHOTO_QUALITY = 0.78;
const CALENDAR_DOUBLE_TAP_MS = 430;
const DAY_NAMES = ["L", "M", "M", "J", "V", "S", "D"];
const MONTHS = [
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie",
];
const STREAK_THRESHOLDS = [3, 5, 10, 20, 50];
const CHALLENGES = [
  { id: "workouts-8-30", title: "8 antrenamente in 30 de zile", description: "Finalizeaza 8 antrenamente in 30 de zile.", type: "completedWorkouts", target: 8, durationDays: 30 },
  { id: "workouts-12-30", title: "12 antrenamente in 30 de zile", description: "Finalizeaza 12 antrenamente in 30 de zile.", type: "completedWorkouts", target: 12, durationDays: 30 },
  { id: "workouts-20-60", title: "20 de antrenamente in 60 de zile", description: "Finalizeaza 20 de antrenamente in 60 de zile.", type: "completedWorkouts", target: 20, durationDays: 60 },
  { id: "streak-5", title: "5 antrenamente consecutive", description: "Respecta 5 antrenamente planificate la rand.", type: "streak", target: 5, durationDays: 45 },
  { id: "volume-10000", title: "10.000 kg volum total", description: "Aduna 10.000 kg volum din seturi finalizate.", type: "volume", target: 10000, durationDays: 60 },
  { id: "volume-25000", title: "25.000 kg volum total", description: "Aduna 25.000 kg volum din seturi finalizate.", type: "volume", target: 25000, durationDays: 90 },
  { id: "records-3", title: "3 recorduri personale", description: "Deblocheaza 3 recorduri personale valide.", type: "records", target: 3, durationDays: 60 },
  { id: "records-5", title: "5 recorduri personale", description: "Deblocheaza 5 recorduri personale valide.", type: "records", target: 5, durationDays: 90 },
];
const ACHIEVEMENTS = [
  { id: "first-workout", category: "Antrenamente", title: "Primul antrenament", description: "Ai finalizat primul antrenament in FitPulse.", metric: "completedWorkouts", threshold: 1 },
  { id: "workouts-5", category: "Antrenamente", title: "5 antrenamente", description: "Ai finalizat 5 antrenamente.", metric: "completedWorkouts", threshold: 5 },
  { id: "workouts-10", category: "Antrenamente", title: "10 antrenamente", description: "Ai finalizat 10 antrenamente.", metric: "completedWorkouts", threshold: 10 },
  { id: "workouts-25", category: "Antrenamente", title: "25 de antrenamente", description: "Ai finalizat 25 de antrenamente.", metric: "completedWorkouts", threshold: 25 },
  { id: "streak-3", category: "Streak", title: "Streak de 3", description: "Ai respectat 3 antrenamente planificate consecutiv.", metric: "streak", threshold: 3 },
  { id: "streak-5", category: "Streak", title: "Streak de 5", description: "Ai respectat 5 antrenamente planificate consecutiv.", metric: "streak", threshold: 5 },
  { id: "volume-5000", category: "Volum", title: "5.000 kg", description: "Ai acumulat 5.000 kg volum valid.", metric: "volume", threshold: 5000 },
  { id: "volume-10000", category: "Volum", title: "10.000 kg", description: "Ai acumulat 10.000 kg volum valid.", metric: "volume", threshold: 10000 },
  { id: "records-1", category: "Recorduri", title: "Primul record personal", description: "Ai atins primul record personal.", metric: "records", threshold: 1 },
  { id: "records-5", category: "Recorduri", title: "5 recorduri", description: "Ai atins 5 recorduri personale.", metric: "records", threshold: 5 },
];

const exerciseMap = {
  "presa": ["Presa picioare 4x10", "Fandari ghidate 3x12", "Ridicari gambe 4x15"],
  "helcometru": ["Tractiuni la helcometru 4x10", "Ramat la cablu 4x12", "Pullover la cablu 3x12"],
  "banca": ["Impins la piept 4x8", "Fluturari cu gantere 3x12", "Impins inclinat 4x10"],
  "gantere": ["Ramat cu gantera 4x10", "Impins umeri 3x10", "Flexii biceps 3x12"],
  "cablu": ["Face pull 3x15", "Triceps pushdown 4x12", "Abdomene la cablu 3x15"],
  "bara": ["Genuflexiuni 4x6", "Indreptari 4x5", "Impins militar 4x8"],
};

const gymExerciseRules = [
  {
    keywords: ["banca", "bench"],
    exercises: {
      "Piept si triceps": ["Impins la piept pe banca 4x8", "Impins inclinat pe banca 3x10", "Fluturari pe banca 3x12"],
      "Spate si biceps": ["Ramat cu pieptul sprijinit pe banca 4x10", "Pullover cu gantera pe banca 3x12"],
      "Umeri si abdomen": ["Impins umeri sezand pe banca 4x8", "Ridicari laterale sezand 3x14"],
      "Full body": ["Impins la piept pe banca 3x8", "Ramat cu gantera pe banca 3x10"],
    },
  },
  {
    keywords: ["gantere", "gantera", "dumbbell"],
    exercises: {
      "Piept si triceps": ["Impins cu gantere 4x8", "Fluturari cu gantere 3x12", "Extensii triceps cu gantera 3x12"],
      "Spate si biceps": ["Ramat cu gantera 4x10", "Flexii biceps cu gantere 3x12", "Hammer curls 3x12"],
      "Picioare": ["Genuflexiuni goblet 4x10", "Fandari cu gantere 3x12", "Indreptari romanesti cu gantere 4x10"],
      "Fesieri": ["Hip thrust cu gantera 4x10", "Fandari bulgaresti cu gantere 3x12", "Indreptari romanesti cu gantere 4x10"],
      "Umeri si abdomen": ["Impins umeri cu gantere 4x8", "Ridicari laterale 3x15", "Russian twist cu gantera 3x20"],
      "Full body": ["Genuflexiuni goblet 3x10", "Impins cu gantere 3x8", "Ramat cu gantera 3x10"],
    },
  },
  {
    keywords: ["helcometru", "lat pulldown", "pulldown"],
    exercises: {
      "Spate si biceps": ["Tractiuni la helcometru 4x10", "Ramat la helcometru 4x12", "Pullover la helcometru 3x12"],
      "Piept si triceps": ["Triceps pushdown la helcometru 4x12", "Extensii triceps deasupra capului 3x12"],
      "Umeri si abdomen": ["Face pull la helcometru 3x15", "Crunch la cablu 3x15"],
      "Full body": ["Tractiuni la helcometru 3x10", "Triceps pushdown 3x12"],
    },
  },
  {
    keywords: ["cablu", "scripete", "crossover"],
    exercises: {
      "Piept si triceps": ["Cable fly 4x12", "Triceps pushdown 4x12", "Extensii triceps la cablu 3x12"],
      "Spate si biceps": ["Ramat la cablu 4x10", "Pullover la cablu 3x12", "Flexii biceps la cablu 3x12"],
      "Picioare": ["Kickback la cablu 3x14", "Abductii la cablu 3x14"],
      "Fesieri": ["Kickback la cablu 4x14", "Abductii la cablu 4x15", "Pull-through la cablu 3x12"],
      "Umeri si abdomen": ["Face pull 3x15", "Ridicari laterale la cablu 3x14", "Crunch la cablu 3x15"],
      "Full body": ["Ramat la cablu 3x10", "Cable fly 3x12", "Crunch la cablu 3x15"],
    },
  },
  {
    keywords: ["presa"],
    exercises: {
      "Picioare": ["Presa picioare 4x10", "Presa cu pozitie ingusta 3x12", "Ridicari gambe la presa 4x15"],
      "Fesieri": ["Presa picioare cu talpile sus 4x10", "Presa unilaterala 3x12", "Presa cu pozitie larga 3x12"],
      "Full body": ["Presa picioare 3x10"],
    },
  },
  {
    keywords: ["bara", "barbell"],
    exercises: {
      "Piept si triceps": ["Impins la piept cu bara 4x8", "Impins inclinat cu bara 3x8"],
      "Spate si biceps": ["Ramat cu bara 4x8", "Indreptari 4x5"],
      "Picioare": ["Genuflexiuni cu bara 4x6", "Indreptari romanesti 4x8", "Fandari cu bara 3x10"],
      "Fesieri": ["Hip thrust cu bara 4x8", "Indreptari romanesti cu bara 4x8", "Fandari cu bara 3x10"],
      "Umeri si abdomen": ["Impins militar 4x8", "Ridicari din umeri cu bara 3x12"],
      "Full body": ["Genuflexiuni cu bara 3x6", "Impins la piept cu bara 3x8", "Ramat cu bara 3x8"],
    },
  },
  {
    keywords: ["flotari", "paralele", "dips"],
    exercises: {
      "Piept si triceps": ["Flotari la paralele 4x8", "Dips asistate 3x10"],
      "Full body": ["Flotari la paralele 3x8"],
    },
  },
  {
    keywords: ["fesieri", "glute", "gluteus", "hip thrust", "abductor", "abductori", "abductie"],
    exercises: {
      "Picioare": ["Abductii la aparat 4x15", "Hip thrust la aparat 4x10"],
      "Fesieri": ["Hip thrust la aparat 4x8", "Abductii la aparat 4x15", "Kickback la aparat 3x14", "Pod pentru fesieri 3x15"],
      "Full body": ["Hip thrust la aparat 3x10", "Abductii la aparat 3x15"],
    },
  },
];

let state = loadState();
let selectedDate = toKey(new Date());
let homeSelectedDate = toKey(new Date());
let homeWeekStart = startOfWeek(new Date());
let visibleMonth = new Date();
let deferredInstallPrompt = null;
let authMode = "login";
let resetMode = "email";
let progressMode = "30";
let currentSession = null;
let isLoadingRemote = false;
let syncTimer = null;
let lastSyncErrorAt = 0;
let eventsBound = false;
let pendingWorkoutDeleteDate = "";
let lastCalendarTap = { key: "", time: 0 };
let miniCalendarSwipeStart = null;
let miniCalendarDidSwipe = false;
let miniCalendarAnimating = false;
let chartPoints = [];
let muscleView = "front";
let restTimerInterval = null;
let audioContext = null;
let currentHydrationDateKey = toKey(new Date());
let hydrationRolloverTimer = null;
let durableProgressTablesAvailable = true;

const supabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  },
});

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const elements = {
  splash: $("#splash"),
  toastHost: $("#toastHost"),
  app: $("#app"),
  authScreen: $("#authScreen"),
  mainScreen: $("#mainScreen"),
  authSwitch: $("#authSwitch"),
  authForm: $("#authForm"),
  authModeButtons: $$(".auth-mode"),
  nameField: $("#nameField"),
  nameInput: $("#nameInput"),
  emailInput: $("#emailInput"),
  passwordInput: $("#passwordInput"),
  passwordToggleButtons: $$(".password-toggle"),
  authSubmitButton: $("#authSubmitButton"),
  forgotPasswordButton: $("#forgotPasswordButton"),
  resetForm: $("#resetForm"),
  resetMethodButtons: $$(".reset-method"),
  resetEmailField: $("#resetEmailField"),
  resetEmailInput: $("#resetEmailInput"),
  resetPhoneField: $("#resetPhoneField"),
  resetPhoneInput: $("#resetPhoneInput"),
  resetCodeField: $("#resetCodeField"),
  resetCodeInput: $("#resetCodeInput"),
  resetPhonePasswordField: $("#resetPhonePasswordField"),
  resetPhonePasswordInput: $("#resetPhonePasswordInput"),
  resetSubmitButton: $("#resetSubmitButton"),
  backToLoginButton: $("#backToLoginButton"),
  newPasswordForm: $("#newPasswordForm"),
  newPasswordInput: $("#newPasswordInput"),
  newPasswordSubmitButton: $("#newPasswordSubmitButton"),
  authStatus: $("#authStatus"),
  authDivider: $("#authDivider"),
  googleAuthButton: $("#googleAuthButton"),
  authSyncNote: $("#authSyncNote"),
  screenTitle: $("#screenTitle"),
  installButton: $("#installButton"),
  welcomeName: $("#welcomeName"),
  streakCount: $("#streakCount"),
  homeWeekCard: $("#homeWeekCard"),
  miniCalendar: $("#miniCalendar"),
  todayWorkout: $("#todayWorkout"),
  hydrationAmount: $("#hydrationAmount"),
  hydrationPercent: $("#hydrationPercent"),
  hydrationBar: $("#hydrationBar"),
  hydrationRemaining: $("#hydrationRemaining"),
  hydrationAddButtons: $$(".hydration-add"),
  customHydrationButton: $("#customHydrationButton"),
  editHydrationButton: $("#editHydrationButton"),
  currentStreakValue: $("#currentStreakValue"),
  bestStreakLabel: $("#bestStreakLabel"),
  streakBar: $("#streakBar"),
  streakNextLabel: $("#streakNextLabel"),
  challengeTitle: $("#challengeTitle"),
  challengeDescription: $("#challengeDescription"),
  challengeBar: $("#challengeBar"),
  challengeMeta: $("#challengeMeta"),
  challengeButton: $("#challengeButton"),
  achievementTitle: $("#achievementTitle"),
  achievementSummary: $("#achievementSummary"),
  achievementsButton: $("#achievementsButton"),
  monthLabel: $("#monthLabel"),
  bigCalendar: $("#bigCalendar"),
  workoutHistory: $("#workoutHistory"),
  trainingCompletedTotal: $("#trainingCompletedTotal"),
  prevMonth: $("#prevMonth"),
  nextMonth: $("#nextMonth"),
  selectedDateLabel: $("#selectedDateLabel"),
  workoutForm: $("#workoutForm"),
  focusInput: $("#focusInput"),
  exerciseInput: $("#exerciseInput"),
  workoutSubmitButton: $("#workoutSubmitButton"),
  statCompleted: $("#statCompleted"),
  statVolume: $("#statVolume"),
  statRecords: $("#statRecords"),
  progressModeButtons: $$(".range-mode"),
  progressRange: $("#progressRange"),
  progressChart: $("#progressChart"),
  chartTooltip: $("#chartTooltip"),
  volumeFilter: $("#volumeFilter"),
  volumeSummary: $("#volumeSummary"),
  muscleMap: $("#muscleMap"),
  muscleViewButtons: $$(".muscle-view"),
  progressPhotoInput: $("#progressPhotoInput"),
  progressPhotoDate: $("#progressPhotoDate"),
  progressPhotos: $("#progressPhotos"),
  profileInitials: $("#profileInitials"),
  profileName: $("#profileName"),
  profileEmail: $("#profileEmail"),
  profileMeta: $("#profileMeta"),
  currentPlanLabel: $("#currentPlanLabel"),
  planToggleButton: $("#planToggleButton"),
  closePlanButton: $("#closePlanButton"),
  planOptions: $("#planOptions"),
  planCards: $$(".plan-card"),
  profileEditor: $("#profileEditor"),
  closeProfileButton: $("#closeProfileButton"),
  profileForm: $("#profileForm"),
  avatarInput: $("#avatarInput"),
  weightInput: $("#weightInput"),
  heightInput: $("#heightInput"),
  goalInput: $("#goalInput"),
  logoutButton: $("#logoutButton"),
  resetProgressButton: $("#resetProgressButton"),
  subscriptionForm: $("#subscriptionForm"),
  editSubscriptionButton: $("#editSubscriptionButton"),
  subscriptionEditor: $("#subscriptionEditor"),
  subscriptionEditorTitle: $("#subscriptionEditorTitle"),
  closeSubscriptionButton: $("#closeSubscriptionButton"),
  subStartInput: $("#subStartInput"),
  subEndInput: $("#subEndInput"),
  subTypeInput: $("#subTypeInput"),
  subPriceInput: $("#subPriceInput"),
  subNotesInput: $("#subNotesInput"),
  subStartError: $("#subStartError"),
  subEndError: $("#subEndError"),
  subPriceError: $("#subPriceError"),
  deleteSubscriptionButton: $("#deleteSubscriptionButton"),
  subscriptionStatus: $("#subscriptionStatus"),
  subscriptionReportButton: $("#subscriptionReportButton"),
  subscriptionReportMeta: $("#subscriptionReportMeta"),
  gymSummaryCard: $("#gymSummaryCard"),
  gymSummary: $("#gymSummary"),
  editGymButton: $("#editGymButton"),
  gymEditor: $("#gymEditor"),
  gymEditorTitle: $("#gymEditorTitle"),
  closeGymButton: $("#closeGymButton"),
  gymForm: $("#gymForm"),
  gymNameInput: $("#gymNameInput"),
  gymLocationInput: $("#gymLocationInput"),
  gymScheduleInput: $("#gymScheduleInput"),
  gymNotesInput: $("#gymNotesInput"),
  gymNameError: $("#gymNameError"),
  equipmentInput: $("#equipmentInput"),
  addEquipmentButton: $("#addEquipmentButton"),
  equipmentList: $("#equipmentList"),
  deleteGymButton: $("#deleteGymButton"),
  startWorkoutButton: $("#startWorkoutButton"),
  activeWorkoutCard: $("#activeWorkoutCard"),
  activeWorkoutSummary: $("#activeWorkoutSummary"),
  activeWorkoutBody: $("#activeWorkoutBody"),
  finishWorkoutButton: $("#finishWorkoutButton"),
  restTimerBar: $("#restTimerBar"),
  restTimerValue: $("#restTimerValue"),
  addRestButton: $("#addRestButton"),
  pauseRestButton: $("#pauseRestButton"),
  skipRestButton: $("#skipRestButton"),
  settingsButton: $("#settingsButton"),
  settingsSummary: $("#settingsSummary"),
  settingsModal: $("#settingsModal"),
  closeSettingsButton: $("#closeSettingsButton"),
  settingsForm: $("#settingsForm"),
  legalButtons: $$("[data-legal-doc]"),
  legalModal: $("#legalModal"),
  legalModalTitle: $("#legalModalTitle"),
  legalModalBody: $("#legalModalBody"),
  closeLegalButton: $("#closeLegalButton"),
  deleteWorkoutModal: $("#deleteWorkoutModal"),
  deleteWorkoutMessage: $("#deleteWorkoutMessage"),
  cancelDeleteWorkoutButton: $("#cancelDeleteWorkoutButton"),
  confirmDeleteWorkoutButton: $("#confirmDeleteWorkoutButton"),
  themeModeInputs: $$("input[name='themeMode']"),
  notificationsSetting: $("#notificationsSetting"),
  vibrationSetting: $("#vibrationSetting"),
  soundSetting: $("#soundSetting"),
  modalOverlay: $("#modalOverlay"),
  hydrationModal: $("#hydrationModal"),
  hydrationModalTitle: $("#hydrationModalTitle"),
  closeHydrationButton: $("#closeHydrationButton"),
  hydrationForm: $("#hydrationForm"),
  hydrationAmountField: $("#hydrationAmountField"),
  hydrationInput: $("#hydrationInput"),
  hydrationTargetField: $("#hydrationTargetField"),
  hydrationTargetInput: $("#hydrationTargetInput"),
  hydrationSubmitButton: $("#hydrationSubmitButton"),
  resetHydrationButton: $("#resetHydrationButton"),
  challengeModal: $("#challengeModal"),
  closeChallengeButton: $("#closeChallengeButton"),
  challengeList: $("#challengeList"),
  achievementsModal: $("#achievementsModal"),
  closeAchievementsButton: $("#closeAchievementsButton"),
  achievementsList: $("#achievementsList"),
  muscleModal: $("#muscleModal"),
  closeMuscleButton: $("#closeMuscleButton"),
  muscleModalTitle: $("#muscleModalTitle"),
  muscleDetails: $("#muscleDetails"),
};

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  elements.installButton.classList.remove("hidden");
});

window.addEventListener("load", async () => {
  applyTheme();
  elements.app.classList.remove("hidden");
  const minimumSplash = new Promise((resolve) => window.setTimeout(resolve, 2600));
  await Promise.all([minimumSplash, boot()]);
  requestAnimationFrame(() => {
    elements.splash.classList.add("is-exiting");
    window.setTimeout(() => elements.splash.classList.add("hidden"), 620);
  });
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {});
}

async function boot() {
  try {
    bindEvents();
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;
    if (data.session) {
      if (isPasswordRecoveryUrl()) {
        currentSession = data.session;
        cleanAuthUrl();
        showPasswordUpdate();
      } else {
        await enterSession(data.session, { silent: true });
      }
    } else {
      showAuth();
    }
  } catch (error) {
    console.error("FitPulse boot failed", error);
    state = normalizeState(state || loadState());
    if (state.user?.email) {
      showMain();
      showToast("Mod offline", "Datele salvate local au ramas active.");
    } else {
      showAuth();
      showToast("Conectare indisponibila", "Incearca din nou peste cateva secunde.");
    }
  }
}

function togglePasswordVisibility(button) {
  const input = document.getElementById(button.dataset.passwordTarget);
  if (!input) return;
  const shouldShow = input.type === "password";
  input.type = shouldShow ? "text" : "password";
  button.textContent = shouldShow ? "Ascunde" : "Arata";
  button.setAttribute("aria-pressed", String(shouldShow));
  button.setAttribute("aria-label", shouldShow ? "Ascunde parola" : "Arata parola");
  input.focus();
}

function cleanAuthUrl() {
  const hasAuthHash = window.location.hash.includes("access_token=") || window.location.hash.includes("refresh_token=");
  const hasAuthCode = window.location.search.includes("code=");
  if (hasAuthHash || hasAuthCode) {
    window.history.replaceState(null, "", APP_URL);
  }
}

function bindEvents() {
  if (eventsBound) return;
  eventsBound = true;
  prepareModalLayer();
  document.addEventListener("pointerdown", handleTapFeedback);
  document.addEventListener("click", handleUpgradeClick);
  elements.authForm.addEventListener("submit", handleAuth);
  elements.forgotPasswordButton.addEventListener("click", () => showResetPanel("email"));
  elements.resetForm.addEventListener("submit", handlePasswordResetRequest);
  elements.resetMethodButtons.forEach((button) => {
    button.addEventListener("click", () => setResetMethod(button.dataset.resetMethod));
  });
  elements.backToLoginButton.addEventListener("click", showLoginPanel);
  elements.newPasswordForm.addEventListener("submit", saveRecoveredPassword);
  elements.authModeButtons.forEach((button) => {
    button.addEventListener("click", () => setAuthMode(button.dataset.authMode));
  });
  elements.passwordToggleButtons.forEach((button) => {
    button.addEventListener("click", () => togglePasswordVisibility(button));
  });
  elements.googleAuthButton.addEventListener("click", handleGoogleAuth);
  elements.homeWeekCard.addEventListener("pointerdown", startMiniCalendarSwipe);
  elements.homeWeekCard.addEventListener("pointermove", moveMiniCalendarSwipe);
  elements.homeWeekCard.addEventListener("pointerup", finishMiniCalendarSwipe);
  elements.homeWeekCard.addEventListener("pointerleave", finishMiniCalendarSwipe);
  elements.homeWeekCard.addEventListener("pointercancel", clearMiniCalendarSwipe);
  elements.homeWeekCard.addEventListener("touchstart", startMiniCalendarTouchSwipe, { passive: true });
  elements.homeWeekCard.addEventListener("touchmove", moveMiniCalendarTouchSwipe, { passive: false });
  elements.homeWeekCard.addEventListener("touchend", finishMiniCalendarTouchSwipe, { passive: true });
  elements.todayWorkout.addEventListener("click", handleExerciseToggle);
  elements.hydrationAddButtons.forEach((button) => button.addEventListener("click", () => addHydration(Number(button.dataset.water))));
  elements.customHydrationButton.addEventListener("click", () => openHydrationModal("add"));
  elements.editHydrationButton.addEventListener("click", () => openHydrationModal("edit"));
  elements.hydrationForm.addEventListener("submit", saveHydrationFromForm);
  elements.resetHydrationButton.addEventListener("click", resetHydration);
  elements.closeHydrationButton.addEventListener("click", closeModals);
  elements.challengeButton.addEventListener("click", openChallengeModal);
  elements.closeChallengeButton.addEventListener("click", closeModals);
  elements.challengeList.addEventListener("click", handleChallengeAction);
  elements.achievementsButton.addEventListener("click", openAchievementsModal);
  elements.closeAchievementsButton.addEventListener("click", closeModals);
  elements.prevMonth.addEventListener("click", () => changeMonth(-1));
  elements.nextMonth.addEventListener("click", () => changeMonth(1));
  elements.workoutForm.addEventListener("submit", saveWorkout);
  elements.exerciseInput.addEventListener("input", updateWorkoutSubmitLabel);
  elements.startWorkoutButton.addEventListener("click", startWorkout);
  elements.finishWorkoutButton.addEventListener("click", finishActiveWorkout);
  elements.activeWorkoutBody.addEventListener("click", handleActiveWorkoutClick);
  elements.activeWorkoutBody.addEventListener("input", handleActiveWorkoutInput);
  elements.activeWorkoutBody.addEventListener("change", handleActiveWorkoutInput);
  elements.addRestButton.addEventListener("click", () => adjustRestTimer(30));
  elements.pauseRestButton.addEventListener("click", toggleRestPause);
  elements.skipRestButton.addEventListener("click", stopRestTimer);
  elements.progressChart.addEventListener("pointermove", showChartTooltip);
  elements.progressChart.addEventListener("pointerleave", hideChartTooltip);
  elements.progressChart.addEventListener("touchmove", showChartTouchTooltip, { passive: true });
  elements.progressChart.addEventListener("touchend", hideChartTooltip, { passive: true });
  elements.volumeFilter.addEventListener("change", renderProgress);
  elements.muscleViewButtons.forEach((button) => button.addEventListener("click", () => setMuscleView(button.dataset.muscleView)));
  elements.muscleMap.addEventListener("click", openMuscleDetails);
  elements.closeMuscleButton.addEventListener("click", closeModals);
  elements.progressPhotoInput.addEventListener("change", saveProgressPhoto);
  elements.progressPhotos.addEventListener("click", deleteProgressPhoto);
  elements.profileInitials.addEventListener("click", toggleProfileEditor);
  elements.planToggleButton.addEventListener("click", togglePlanOptions);
  elements.closeProfileButton.addEventListener("click", closeModals);
  elements.closePlanButton.addEventListener("click", closeModals);
  elements.settingsButton.addEventListener("click", toggleSettingsModal);
  elements.closeSettingsButton.addEventListener("click", closeModals);
  elements.settingsForm.addEventListener("submit", saveSettings);
  elements.legalButtons.forEach((button) => button.addEventListener("click", () => openLegalModal(button.dataset.legalDoc)));
  elements.closeLegalButton.addEventListener("click", closeModals);
  elements.cancelDeleteWorkoutButton.addEventListener("click", closeModals);
  elements.confirmDeleteWorkoutButton.addEventListener("click", confirmDeleteWorkout);
  elements.themeModeInputs.forEach((input) => input.addEventListener("change", previewThemeSetting));
  elements.modalOverlay.addEventListener("click", closeModals);
  elements.planCards.forEach((button) => button.addEventListener("click", () => selectPlan(button.dataset.plan)));
  elements.profileForm.addEventListener("submit", saveProfile);
  elements.avatarInput.addEventListener("change", handleAvatarImage);
  elements.logoutButton.addEventListener("click", logout);
  elements.resetProgressButton.addEventListener("click", resetProgress);
  elements.editSubscriptionButton.addEventListener("click", openSubscriptionEditor);
  elements.closeSubscriptionButton.addEventListener("click", closeModals);
  elements.subscriptionForm.addEventListener("submit", saveSubscription);
  elements.deleteSubscriptionButton.addEventListener("click", deleteSubscription);
  elements.subscriptionReportButton.addEventListener("click", downloadSubscriptionReport);
  elements.editGymButton.addEventListener("click", openGymEditor);
  elements.closeGymButton.addEventListener("click", closeModals);
  elements.gymForm.addEventListener("submit", saveEquipment);
  elements.addEquipmentButton.addEventListener("click", addEquipmentDraft);
  elements.equipmentList.addEventListener("click", removeEquipmentDraft);
  elements.deleteGymButton.addEventListener("click", deleteGym);
  elements.installButton.addEventListener("click", installApp);
  elements.progressModeButtons.forEach((button) => {
    button.addEventListener("click", () => setProgressMode(button.dataset.progressMode));
  });
  window.addEventListener("pagehide", flushStateBeforeExit);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushStateBeforeExit();
  });
  scheduleHydrationRollover();

  $$(".tab").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === "PASSWORD_RECOVERY" && session) {
      currentSession = session;
      cleanAuthUrl();
      showPasswordUpdate();
      return;
    }
    if (event === "SIGNED_IN" && session && session.user.id !== currentSession?.user?.id) {
      enterSession(session).catch((error) => {
        console.error("Supabase session load failed", error);
        showToast("Sincronizare oprita", "Nu am putut incarca datele contului.");
      });
    }
    if (event === "SIGNED_OUT") {
      currentSession = null;
    }
  });
}

async function handleAuth(event) {
  event.preventDefault();
  const email = elements.emailInput.value.trim().toLowerCase();
  const password = elements.passwordInput.value.trim();
  const name = elements.nameInput.value.trim();
  elements.authSubmitButton.disabled = true;
  elements.authSubmitButton.textContent = authMode === "login" ? "Se conecteaza..." : "Se creeaza...";
  showAuthStatus("Se verifica datele contului...", "info");
  try {
    if (authMode === "signup" && await emailAlreadyRegistered(email)) {
      showAuthStatus("Ai deja cont pe acest email. Intra pe Login sau reseteaza parola.", "error");
      showToast("Cont existent", "Foloseste Login sau resetarea parolei.");
      return;
    }
    const response = authMode === "login"
      ? await supabaseClient.auth.signInWithPassword({ email, password })
      : await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { name },
          emailRedirectTo: APP_URL,
        },
      });

    if (response.error) throw response.error;
    if (authMode === "signup" && isExistingSignupResponse(response)) {
      showAuthStatus("Ai deja cont pe acest email. Intra pe Login sau reseteaza parola.", "error");
      showToast("Cont existent", "Emailul este deja folosit in FitPulse.");
      return;
    }
    if (!response.data.session) {
      showAuthStatus("Cont creat. Verifica emailul si confirma contul, apoi revino la Login.", "success");
      showToast("Confirma emailul", "Dupa confirmare te poti conecta cu email si parola.");
      return;
    }
    await enterSession(response.data.session, { displayName: name });
    showAuthStatus("", "info");
    showToast(authMode === "login" ? "Login activ" : "Cont creat", "Datele se sincronizeaza prin Supabase.");
  } catch (error) {
    console.error("Supabase auth failed", error);
    const message = authErrorMessage(error);
    showAuthStatus(message, "error");
    showToast("Autentificare esuata", message);
  } finally {
    elements.authSubmitButton.disabled = false;
    elements.authSubmitButton.textContent = authMode === "login" ? "Login" : "Creeaza cont";
  }
}

function showAuth() {
  showLoginPanel();
  elements.authScreen.classList.remove("hidden");
  elements.mainScreen.classList.add("hidden");
}

function showLoginPanel() {
  elements.authForm.classList.remove("hidden");
  elements.authSwitch.classList.remove("hidden");
  elements.authDivider.classList.remove("hidden");
  elements.googleAuthButton.classList.remove("hidden");
  elements.authSyncNote.classList.remove("hidden");
  elements.resetForm.classList.add("hidden");
  elements.newPasswordForm.classList.add("hidden");
  elements.resetCodeField.classList.add("hidden");
  elements.resetPhonePasswordField.classList.add("hidden");
  elements.resetCodeInput.value = "";
  elements.resetPhonePasswordInput.value = "";
  setAuthMode(authMode);
}

function setAuthMode(mode) {
  authMode = mode === "signup" ? "signup" : "login";
  elements.authModeButtons.forEach((button) => button.classList.toggle("active", button.dataset.authMode === authMode));
  elements.nameField.classList.toggle("hidden", authMode === "login");
  elements.nameInput.required = authMode === "signup";
  elements.passwordInput.autocomplete = authMode === "login" ? "current-password" : "new-password";
  elements.authSubmitButton.textContent = authMode === "login" ? "Login" : "Creeaza cont";
  showAuthStatus("", "info");
}

function showResetPanel(method = "email") {
  elements.authForm.classList.add("hidden");
  elements.authSwitch.classList.add("hidden");
  elements.authDivider.classList.add("hidden");
  elements.googleAuthButton.classList.add("hidden");
  elements.authSyncNote.classList.add("hidden");
  elements.newPasswordForm.classList.add("hidden");
  elements.resetForm.classList.remove("hidden");
  setResetMethod(method);
  showAuthStatus("", "info");
}

function showPasswordUpdate() {
  elements.authScreen.classList.remove("hidden");
  elements.mainScreen.classList.add("hidden");
  elements.authForm.classList.add("hidden");
  elements.authSwitch.classList.add("hidden");
  elements.authDivider.classList.add("hidden");
  elements.googleAuthButton.classList.add("hidden");
  elements.authSyncNote.classList.add("hidden");
  elements.resetForm.classList.add("hidden");
  elements.newPasswordForm.classList.remove("hidden");
  showAuthStatus("Seteaza parola noua pentru contul tau.", "success");
}

function setResetMethod(method) {
  resetMode = method === "phone" ? "phone" : "email";
  elements.resetMethodButtons.forEach((button) => button.classList.toggle("active", button.dataset.resetMethod === resetMode));
  const isPhone = resetMode === "phone";
  elements.resetEmailField.classList.toggle("hidden", isPhone);
  elements.resetPhoneField.classList.toggle("hidden", !isPhone);
  elements.resetCodeField.classList.toggle("hidden", true);
  elements.resetPhonePasswordField.classList.toggle("hidden", true);
  elements.resetSubmitButton.textContent = isPhone ? "Trimite cod" : "Trimite link";
}

async function handlePasswordResetRequest(event) {
  event.preventDefault();
  elements.resetSubmitButton.disabled = true;
  showAuthStatus("Se pregateste resetarea parolei...", "info");
  try {
    if (resetMode === "email") {
      const email = elements.resetEmailInput.value.trim().toLowerCase();
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, { redirectTo: APP_URL });
      if (error) throw error;
      showAuthStatus("Ti-am trimis linkul de resetare pe email.", "success");
      showToast("Verifica emailul", "Linkul de resetare a parolei a fost trimis.");
      return;
    }

    const phone = elements.resetPhoneInput.value.trim();
    const code = elements.resetCodeInput.value.trim();
    const newPassword = elements.resetPhonePasswordInput.value.trim();
    if (!code) {
      const { error } = await supabaseClient.auth.signInWithOtp({
        phone,
        options: { shouldCreateUser: false },
      });
      if (error) throw error;
      elements.resetCodeField.classList.remove("hidden");
      elements.resetPhonePasswordField.classList.remove("hidden");
      elements.resetSubmitButton.textContent = "Verifica si salveaza";
      showAuthStatus("Codul SMS a fost trimis.", "success");
      showToast("Cod trimis", "Introdu codul si parola noua.");
      return;
    }

    if (newPassword.length < 6) {
      throw new Error("Password should be at least 6 characters");
    }
    const { data, error } = await supabaseClient.auth.verifyOtp({ phone, token: code, type: "sms" });
    if (error) throw error;
    currentSession = data.session;
    const { error: updateError } = await supabaseClient.auth.updateUser({ password: newPassword });
    if (updateError) throw updateError;
    await supabaseClient.auth.signOut();
    currentSession = null;
    authMode = "login";
    showLoginPanel();
    showAuthStatus("Parola a fost schimbata. Te poti conecta acum.", "success");
    showToast("Parola schimbata", "Conecteaza-te cu parola noua.");
  } catch (error) {
    console.error("Password reset failed", error);
    const message = authErrorMessage(error);
    showAuthStatus(message, "error");
    showToast("Resetare esuata", message);
  } finally {
    elements.resetSubmitButton.disabled = false;
  }
}

async function saveRecoveredPassword(event) {
  event.preventDefault();
  const password = elements.newPasswordInput.value.trim();
  elements.newPasswordSubmitButton.disabled = true;
  showAuthStatus("Se salveaza parola noua...", "info");
  try {
    const { error } = await supabaseClient.auth.updateUser({ password });
    if (error) throw error;
    await supabaseClient.auth.signOut();
    currentSession = null;
    authMode = "login";
    elements.newPasswordInput.value = "";
    showLoginPanel();
    showAuthStatus("Parola a fost schimbata. Te poti conecta acum.", "success");
    showToast("Parola salvata", "Login-ul este pregatit cu parola noua.");
  } catch (error) {
    console.error("Recovered password save failed", error);
    const message = authErrorMessage(error);
    showAuthStatus(message, "error");
    showToast("Parola nesalvata", message);
  } finally {
    elements.newPasswordSubmitButton.disabled = false;
  }
}

async function handleGoogleAuth() {
  showAuthStatus("Se deschide Google...", "info");
  const redirectTo = encodeURIComponent(APP_URL);
  window.location.assign(`${SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`);
}

function showMain() {
  elements.authScreen.classList.add("hidden");
  elements.mainScreen.classList.remove("hidden");
  hydrateAccount();
  renderAll();
}

async function enterSession(session, options = {}) {
  currentSession = session;
  const localBefore = loadState();
  const authUser = session.user;
  const sessionUser = userFromSupabase(authUser, options.displayName);
  isLoadingRemote = true;
  try {
    const remoteState = await loadRemoteState(authUser, sessionUser);
    const shouldMigrateLocal = hasLocalProgress(localBefore) && !hasRemoteProgress(remoteState);
    state = shouldMigrateLocal ? {
      ...localBefore,
      user: {
        ...sessionUser,
        name: localBefore.user?.name || sessionUser.name,
        profile: {
          ...sessionUser.profile,
          ...(localBefore.user?.profile || {}),
        },
      },
    } : mergeLatestState(localBefore, remoteState, sessionUser);
    if (!state.gym.equipment.length) {
      state.gym.equipment = ["banca reglabila", "gantere", "helcometru", "presa picioare"];
    }
    cleanAuthUrl();
    persistStateLocal();
    showMain();
    if (shouldMigrateLocal) {
      await syncRemoteState({ force: true });
      if (!options.silent) showToast("Date migrate", "Progresul local a fost mutat in contul tau online.");
    } else if (hasLocalUnsyncedState(localBefore, remoteState, sessionUser)) {
      await syncRemoteState({ force: true });
    }
  } finally {
    isLoadingRemote = false;
  }
}

function mergeLatestState(localState, remoteState, sessionUser) {
  const local = normalizeState(localState);
  const remote = normalizeState(remoteState);
  const sameAccount = local.user?.email && sessionUser?.email
    && local.user.email.toLowerCase() === sessionUser.email.toLowerCase();
  if (!sameAccount) return remote;
  const merged = {
    ...remote,
    workouts: mergeWorkoutPlans(remote.workouts, local.workouts),
    hydration: mergeDatedObjects(remote.hydration, local.hydration),
    subscription: chooseNewerObject(remote.subscription, local.subscription),
    gym: chooseNewerObject(remote.gym, local.gym),
    challenge: chooseNewerObject(remote.challenge, local.challenge),
    settings: chooseNewerObject(remote.settings, local.settings),
    exerciseNotes: { ...(remote.exerciseNotes || {}), ...(local.exerciseNotes || {}) },
    sessions: mergeById(remote.sessions, local.sessions),
    personalRecords: mergeById(remote.personalRecords, local.personalRecords),
    achievements: mergeById(remote.achievements, local.achievements),
    progressPhotos: mergeById(remote.progressPhotos, local.progressPhotos),
  };
  if (local.activeWorkout?.status === "active" && shouldKeepLocalActiveWorkout(local.activeWorkout, remote.activeWorkout)) {
    merged.activeWorkout = local.activeWorkout;
  }
  return merged;
}

function hasLocalUnsyncedState(localState, remoteState, sessionUser) {
  const merged = mergeLatestState(localState, remoteState, sessionUser);
  return JSON.stringify(normalizeState(merged)) !== JSON.stringify(normalizeState(remoteState));
}

function shouldKeepLocalActiveWorkout(localActive, remoteActive) {
  if (!remoteActive || remoteActive.status !== "active") return true;
  return new Date(localActive.startedAt || 0) >= new Date(remoteActive.startedAt || 0);
}

function mergeWorkoutPlans(primary = {}, secondary = {}) {
  const result = { ...(primary || {}) };
  Object.entries(secondary || {}).forEach(([date, localWorkout]) => {
    if (!localWorkout || typeof localWorkout !== "object") return;
    const remoteWorkout = result[date];
    if (!remoteWorkout) {
      result[date] = localWorkout;
      return;
    }
    const remoteChecks = remoteWorkout.exerciseChecks || {};
    const localChecks = localWorkout.exerciseChecks || {};
    const localCheckedCount = Object.values(localChecks).filter(Boolean).length;
    const remoteCheckedCount = Object.values(remoteChecks).filter(Boolean).length;
    if (localWorkout.completed && !remoteWorkout.completed) {
      result[date] = localWorkout;
      return;
    }
    if (localCheckedCount > remoteCheckedCount) {
      result[date] = {
        ...remoteWorkout,
        exerciseChecks: { ...remoteChecks, ...localChecks },
        completed: localWorkout.completed || remoteWorkout.completed,
      };
    }
  });
  return result;
}

function chooseNewerObject(primary, secondary) {
  if (!secondary || typeof secondary !== "object") return primary;
  if (!primary || typeof primary !== "object") return secondary;
  const primaryTime = new Date(primary.updatedAt || primary.createdAt || 0).getTime();
  const secondaryTime = new Date(secondary.updatedAt || secondary.createdAt || 0).getTime();
  return secondaryTime > primaryTime ? secondary : primary;
}

function mergeDatedObjects(primary = {}, secondary = {}) {
  const result = { ...(primary || {}) };
  Object.entries(secondary || {}).forEach(([key, value]) => {
    if (!value || typeof value !== "object") return;
    const existing = result[key];
    const existingTime = new Date(existing?.updatedAt || existing?.createdAt || 0).getTime();
    const valueTime = new Date(value.updatedAt || value.createdAt || 0).getTime();
    if (!existing || valueTime >= existingTime) result[key] = value;
  });
  return result;
}

function mergeById(primary = [], secondary = []) {
  const result = [];
  const byId = new Map();
  [...(primary || []), ...(secondary || [])].forEach((item) => {
    if (!item || typeof item !== "object") return;
    const id = item.id || `${item.workoutDate || item.date || item.achievedAt || ""}-${item.createdAt || item.startedAt || ""}`;
    if (byId.has(id)) {
      const index = byId.get(id);
      result[index] = mergeObjectFields(result[index], item);
      return;
    }
    byId.set(id, result.length);
    result.push(item);
  });
  return result;
}

function mergeObjectFields(primary = {}, secondary = {}) {
  const merged = { ...secondary, ...primary };
  Object.entries(secondary || {}).forEach(([key, value]) => {
    if ((merged[key] === "" || merged[key] == null) && value != null && value !== "") {
      merged[key] = value;
    }
  });
  return merged;
}

function userFromSupabase(authUser, fallbackName = "") {
  const meta = authUser.user_metadata || {};
  const email = authUser.email || "";
  return {
    id: authUser.id,
    name: fallbackName || meta.name || meta.full_name || email.split("@")[0] || "Contul tau",
    email,
    authProvider: "supabase",
    profile: defaultProfile(),
  };
}

async function loadRemoteState(authUser, sessionUser) {
  const userId = authUser.id;
  const [
    profileResult,
    workoutsResult,
    subscriptionResult,
    gymResult,
    appStateResult,
    sessionsResult,
    recordsResult,
    photosResult,
  ] = await Promise.all([
    supabaseClient.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabaseClient.from("workouts").select("*").eq("user_id", userId).order("workout_date", { ascending: true }),
    supabaseClient.from("subscriptions").select("*").eq("user_id", userId).maybeSingle(),
    supabaseClient.from("gyms").select("*").eq("user_id", userId).maybeSingle(),
    supabaseClient.from("app_states").select("state").eq("user_id", userId).maybeSingle(),
    supabaseClient.from("workout_sessions").select("payload").eq("user_id", userId).order("workout_date", { ascending: true }),
    supabaseClient.from("personal_records").select("payload").eq("user_id", userId).order("achieved_at", { ascending: true }),
    supabaseClient.from("progress_photos").select("payload").eq("user_id", userId).order("photo_date", { ascending: false }),
  ]);

  [profileResult, workoutsResult, subscriptionResult, gymResult].forEach((result) => {
    if (result.error) throw result.error;
  });
  if (appStateResult.error) {
    console.warn("App state table unavailable", appStateResult.error);
  }
  durableProgressTablesAvailable = !sessionsResult.error && !recordsResult.error && !photosResult.error;
  if (!durableProgressTablesAvailable) {
    console.warn("Dedicated progress tables unavailable; using app state fallback", sessionsResult.error || recordsResult.error || photosResult.error);
  }

  const profile = profileResult.data;
  const snapshot = appStateResult.data?.state ? normalizeState(appStateResult.data.state) : defaultState();
  const remote = normalizeState(snapshot);
  const sessionRows = durableProgressTablesAvailable ? (sessionsResult.data || []).map((row) => row.payload).filter(Boolean) : [];
  const recordRows = durableProgressTablesAvailable ? (recordsResult.data || []).map((row) => row.payload).filter(Boolean) : [];
  const photoRows = durableProgressTablesAvailable ? (photosResult.data || []).map((row) => row.payload).filter(Boolean) : [];
  remote.user = {
    ...sessionUser,
    name: profile?.name || sessionUser.name,
    email: profile?.email || sessionUser.email,
    profile: {
      avatar: profile?.avatar_url || "",
      weight: profile?.weight_kg ? String(profile.weight_kg) : "",
      height: profile?.height_cm ? String(profile.height_cm) : "",
      goal: profile?.goal || "",
      waterTargetMl: Number(profile?.water_target_ml || snapshot.user?.profile?.waterTargetMl || snapshot.settings?.waterTargetMl || 2500),
    },
  };
  remote.plan = PLAN_LIMITS[profile?.plan] ? profile.plan : "free";
  remote.workouts = Object.fromEntries((workoutsResult.data || []).map((workout) => [
    workout.workout_date,
    (() => {
      const snapshotWorkout = snapshot.workouts?.[workout.workout_date] || {};
      return {
      planned: workout.planned,
      focus: workout.focus,
      exercises: workout.exercises || "",
      exercisePrescriptions: snapshotWorkout.exercisePrescriptions || {},
      exerciseChecks: workout.exercise_checks || {},
      completed: workout.completed,
      };
    })(),
  ]));
  remote.subscription = {
    ...defaultSubscription(),
    ...(snapshot.subscription || {}),
    start: subscriptionResult.data?.start_date || snapshot.subscription?.start || "",
    end: subscriptionResult.data?.end_date || snapshot.subscription?.end || "",
    type: subscriptionResult.data?.membership_type || snapshot.subscription?.type || "",
    price: subscriptionResult.data?.price ? String(subscriptionResult.data.price) : snapshot.subscription?.price || "",
    notes: subscriptionResult.data?.notes || snapshot.subscription?.notes || "",
    updatedAt: subscriptionResult.data?.updated_at || snapshot.subscription?.updatedAt || "",
  };
  remote.gym = {
    ...defaultGym(),
    ...(snapshot.gym || {}),
    name: gymResult.data?.name || snapshot.gym?.name || "",
    location: gymResult.data?.location || snapshot.gym?.location || "",
    schedule: gymResult.data?.schedule || snapshot.gym?.schedule || "",
    equipment: Array.isArray(gymResult.data?.equipment) ? gymResult.data.equipment : Array.isArray(snapshot.gym?.equipment) ? snapshot.gym.equipment : [],
    notes: gymResult.data?.notes || snapshot.gym?.notes || "",
    updatedAt: gymResult.data?.updated_at || snapshot.gym?.updatedAt || "",
  };
  if (durableProgressTablesAvailable) {
    remote.sessions = mergeById(sessionRows, snapshot.sessions);
    remote.personalRecords = mergeById(recordRows, snapshot.personalRecords);
    remote.progressPhotos = mergeById(photoRows, snapshot.progressPhotos);
  }
  if (!profile) {
    await syncProfile(userId, remote.user);
  }
  return remote;
}

function switchView(viewId) {
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === viewId));
  $$(".tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.view === viewId));
  const titles = {
    homeView: "Acasa",
    trainingView: "Antrenament",
    progressView: "Progres",
    accountView: "Cont",
  };
  elements.screenTitle.textContent = titles[viewId] || "FitPulse";
  if (viewId === "trainingView") {
    renderTrainingSummary();
  }
  if (viewId === "progressView") {
    renderProgress();
  }
}

function renderAll() {
  renderHome();
  renderTrainingCalendar();
  renderTrainingSummary();
  renderSelectedWorkout();
  renderActiveWorkout();
  renderProgress();
  renderAccount();
  tickRestTimer();
}

function renderHome() {
  const firstName = state.user?.name?.split(" ")[0] || "sportiv";
  elements.welcomeName.textContent = `Bun venit, ${firstName}!`;
  elements.streakCount.textContent = String(countCompleted());
  renderMiniCalendar();
  renderTodayWorkout();
  renderHydration();
  renderStreak();
  renderChallenge();
  renderAchievementCard();
}

function renderMiniCalendar() {
  const today = new Date();
  const monday = homeWeekStart;
  elements.miniCalendar.innerHTML = "";
  elements.miniCalendar.style.transform = "";
  elements.miniCalendar.classList.remove("dragging", "slide-out-left", "slide-out-right", "slide-in-left", "slide-in-right");

  for (let index = 0; index < 7; index += 1) {
    const date = addDays(monday, index);
    const key = toKey(date);
    const workout = state.workouts[key];
    const item = document.createElement("button");
    item.type = "button";
    item.className = "day-pill";
    item.innerHTML = `<small>${DAY_NAMES[index]}</small><strong>${date.getDate()}</strong>`;
    item.classList.toggle("done", isWorkoutCompleted(workout));
    item.classList.toggle("planned", Boolean(workout?.planned));
    item.classList.toggle("today", key === toKey(today));
    item.classList.toggle("selected", key === homeSelectedDate);
    item.addEventListener("click", () => {
      if (miniCalendarDidSwipe) {
        miniCalendarDidSwipe = false;
        return;
      }
      homeSelectedDate = key;
      homeWeekStart = startOfWeek(date);
      selectedDate = key;
      visibleMonth = new Date(date);
      renderHome();
      renderTrainingCalendar();
      renderSelectedWorkout();
    });
    elements.miniCalendar.appendChild(item);
  }
}

function startMiniCalendarSwipe(event) {
  if (miniCalendarAnimating) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  event.currentTarget.setPointerCapture?.(event.pointerId);
  miniCalendarSwipeStart = {
    x: event.clientX,
    y: event.clientY,
    time: Date.now(),
    changed: false,
  };
}

function moveMiniCalendarSwipe(event) {
  if (!miniCalendarSwipeStart) return;
  dragHomeWeek(event.clientX, event.clientY);
}

function finishMiniCalendarSwipe(event) {
  if (!miniCalendarSwipeStart) return;
  releaseHomeWeekSwipe(event.clientX, event.clientY);
  miniCalendarSwipeStart = null;
}

function clearMiniCalendarSwipe() {
  miniCalendarSwipeStart = null;
  resetHomeWeekDrag();
}

function startMiniCalendarTouchSwipe(event) {
  if (miniCalendarAnimating) return;
  const touch = event.changedTouches?.[0];
  if (!touch) return;
  miniCalendarSwipeStart = {
    x: touch.clientX,
    y: touch.clientY,
    time: Date.now(),
    changed: false,
  };
}

function moveMiniCalendarTouchSwipe(event) {
  const touch = event.changedTouches?.[0];
  if (!touch || !miniCalendarSwipeStart) return;
  const dragged = dragHomeWeek(touch.clientX, touch.clientY);
  if (dragged) event.preventDefault();
}

function finishMiniCalendarTouchSwipe(event) {
  const touch = event.changedTouches?.[0];
  if (!touch || !miniCalendarSwipeStart) return;
  finishMiniCalendarSwipe({
    clientX: touch.clientX,
    clientY: touch.clientY,
  });
}

function dragHomeWeek(clientX, clientY) {
  if (!miniCalendarSwipeStart || miniCalendarSwipeStart.changed) return false;
  const deltaX = clientX - miniCalendarSwipeStart.x;
  const deltaY = clientY - miniCalendarSwipeStart.y;
  if (Math.abs(deltaX) < 8 || Math.abs(deltaY) > 90) return false;
  const limitedDelta = Math.max(-180, Math.min(180, deltaX));
  elements.miniCalendar.classList.add("dragging");
  elements.miniCalendar.style.transform = `translateX(${limitedDelta}px)`;
  return true;
}

function releaseHomeWeekSwipe(clientX, clientY) {
  if (!miniCalendarSwipeStart || miniCalendarSwipeStart.changed) return;
  const deltaX = clientX - miniCalendarSwipeStart.x;
  const deltaY = clientY - miniCalendarSwipeStart.y;
  const elapsed = Date.now() - miniCalendarSwipeStart.time;
  const shouldChange = Math.abs(deltaX) >= 74 && Math.abs(deltaY) <= 90 && elapsed <= 1400;
  if (!shouldChange) {
    resetHomeWeekDrag();
    return;
  }
  animateHomeWeekChange(deltaX < 0 ? 7 : -7);
}

function resetHomeWeekDrag() {
  elements.miniCalendar.classList.remove("dragging");
  elements.miniCalendar.style.transform = "";
}

function animateHomeWeekChange(dayOffset) {
  if (!miniCalendarSwipeStart) return;
  miniCalendarSwipeStart.changed = true;
  miniCalendarAnimating = true;
  miniCalendarDidSwipe = true;
  const outgoingClass = dayOffset > 0 ? "slide-out-left" : "slide-out-right";
  const incomingClass = dayOffset > 0 ? "slide-in-right" : "slide-in-left";
  elements.miniCalendar.classList.remove("dragging");
  elements.miniCalendar.style.transform = "";
  elements.miniCalendar.classList.add(outgoingClass);
  window.setTimeout(() => {
    changeHomeWeek(dayOffset);
    elements.miniCalendar.classList.add(incomingClass);
    window.setTimeout(() => {
      elements.miniCalendar.classList.remove(incomingClass);
      miniCalendarDidSwipe = false;
      miniCalendarAnimating = false;
    }, 260);
  }, 180);
}

function changeHomeWeek(dayOffset) {
  const nextDate = addDays(parseLocalDate(homeSelectedDate), dayOffset);
  homeSelectedDate = toKey(nextDate);
  homeWeekStart = startOfWeek(nextDate);
  selectedDate = homeSelectedDate;
  visibleMonth = new Date(nextDate);
  renderHome();
  renderTrainingCalendar();
  renderSelectedWorkout();
}

function renderTodayWorkout() {
  const key = homeSelectedDate;
  const workout = state.workouts[key];
  const heading = key === toKey(new Date()) ? "Azi" : formatDateLong(key);
  if (!workout?.planned) {
    elements.todayWorkout.innerHTML = `
      <strong>${heading}</strong>
      <p>Nu ai antrenament planificat pentru ziua selectata.</p>
    `;
    return;
  }
  const exerciseLines = parseExerciseLines(workout.exercises);
  const exercises = exerciseLines
    .map((line) => {
      return `
        <li>
          <span class="exercise-marker" aria-hidden="true"></span>
          <span>${escapeHtml(line)}</span>
        </li>
      `;
    })
    .join("");
  elements.todayWorkout.innerHTML = `
    <span class="workout-date">${heading}</span>
    <strong>${escapeHtml(workout.focus)}</strong>
    <ul class="exercise-checklist">${exercises}</ul>
  `;
}

function todayHydration() {
  const key = toKey(new Date());
  state.hydration = state.hydration || {};
  const targetMl = Number(state.user?.profile?.waterTargetMl || state.settings?.waterTargetMl || 2500);
  state.hydration[key] = {
    date: key,
    consumedMl: Number(state.hydration[key]?.consumedMl || 0),
    targetMl: Number(state.hydration[key]?.targetMl || targetMl || 2500),
    updatedAt: state.hydration[key]?.updatedAt || new Date().toISOString(),
  };
  return state.hydration[key];
}

function renderHydration() {
  const entry = todayHydration();
  const percent = entry.targetMl ? Math.round((entry.consumedMl / entry.targetMl) * 100) : 0;
  const remaining = Math.max(0, entry.targetMl - entry.consumedMl);
  elements.hydrationAmount.textContent = `${formatMl(entry.consumedMl)} / ${formatMl(entry.targetMl)}`;
  elements.hydrationPercent.textContent = percent >= 100 ? "Obiectiv atins" : `${percent}%`;
  elements.hydrationBar.style.width = `${Math.min(100, percent)}%`;
  elements.hydrationRemaining.textContent = remaining
    ? `Mai ai ${formatMl(remaining)} pana la obiectiv.`
    : `Ai depasit obiectivul cu ${formatMl(entry.consumedMl - entry.targetMl)}.`;
}

function scheduleHydrationRollover() {
  window.clearTimeout(hydrationRolloverTimer);
  const now = new Date();
  const nextMidnight = new Date(now);
  nextMidnight.setHours(24, 0, 1, 0);
  hydrationRolloverTimer = window.setTimeout(() => {
    const nextKey = toKey(new Date());
    if (nextKey !== currentHydrationDateKey) {
      currentHydrationDateKey = nextKey;
      todayHydration();
      saveState();
      renderHydration();
      renderProgress();
      showToast("Zi noua", "Hidratarea a inceput de la 0 ml, istoricul a ramas salvat.");
    }
    scheduleHydrationRollover();
  }, Math.min(nextMidnight.getTime() - now.getTime(), 2147483647));
}

function addHydration(amount) {
  if (!Number.isFinite(amount) || amount <= 0 || amount > 5000) {
    showToast("Cantitate invalida", "Alege o valoare intre 1 si 5.000 ml.");
    return;
  }
  const entry = todayHydration();
  entry.consumedMl = Math.max(0, entry.consumedMl + amount);
  entry.updatedAt = new Date().toISOString();
  saveState();
  renderHydration();
  showToast("Apa adaugata", `${formatMl(amount)} au fost adaugati pentru azi.`);
}

function openHydrationModal(mode) {
  const entry = todayHydration();
  const isEditMode = mode === "edit";
  elements.hydrationInput.value = "";
  elements.hydrationTargetInput.value = entry.targetMl;
  elements.hydrationModalTitle.textContent = isEditMode ? "Editeaza hidratarea" : "Alta cantitate";
  elements.hydrationForm.dataset.mode = mode;
  elements.hydrationAmountField.classList.toggle("hidden", isEditMode);
  elements.hydrationTargetField.classList.toggle("hidden", !isEditMode);
  elements.hydrationTargetField.classList.toggle("hydration-target-only", isEditMode);
  elements.resetHydrationButton.classList.toggle("hidden", !isEditMode);
  elements.hydrationInput.required = !isEditMode;
  elements.hydrationTargetInput.required = isEditMode;
  elements.hydrationSubmitButton.textContent = isEditMode ? "Salveaza obiectiv" : "Adauga";
  openModal(elements.hydrationModal);
}

function saveHydrationFromForm(event) {
  event.preventDefault();
  const isEditMode = elements.hydrationForm.dataset.mode === "edit";
  const entry = todayHydration();
  if (isEditMode) {
    const target = Number(elements.hydrationTargetInput.value);
    if (!Number.isFinite(target) || target < 500 || target > 8000) {
      showToast("Obiectiv invalid", "Obiectivul trebuie sa fie intre 500 si 8.000 ml.");
      return;
    }
    entry.targetMl = target;
    state.settings.waterTargetMl = target;
    if (state.user?.profile) state.user.profile.waterTargetMl = target;
  } else {
    const amount = Number(elements.hydrationInput.value);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 5000) {
      showToast("Cantitate invalida", "Cantitatea trebuie sa fie intre 1 si 5.000 ml.");
      return;
    }
    entry.consumedMl = Math.max(0, entry.consumedMl + amount);
  }
  entry.updatedAt = new Date().toISOString();
  saveState();
  renderHydration();
  closeModals();
  showToast(
    "Hidratare salvata",
    isEditMode ? "Obiectivul zilnic a fost actualizat." : "Cantitatea a fost adaugata pentru ziua curenta.",
  );
}

function resetHydration() {
  if (!window.confirm("Sigur vrei sa resetezi hidratarea de azi?")) return;
  const entry = todayHydration();
  entry.consumedMl = 0;
  entry.updatedAt = new Date().toISOString();
  saveState();
  renderHydration();
  closeModals();
  showToast("Hidratare resetata", "Ziua curenta a fost resetata la 0 ml.");
}

function calculateStreak() {
  const plannedEntries = Object.entries(state.workouts || {})
    .filter(([date, workout]) => workout?.planned && date <= toKey(new Date()))
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA));
  let current = 0;
  for (const [, workout] of plannedEntries) {
    if (isWorkoutCompleted(workout)) current += 1;
    else break;
  }
  const chronological = plannedEntries.slice().reverse();
  let running = 0;
  let best = Number(state.progress?.bestStreak || 0);
  chronological.forEach(([, workout]) => {
    if (isWorkoutCompleted(workout)) {
      running += 1;
      best = Math.max(best, running);
    } else {
      running = 0;
    }
  });
  state.progress = { ...(state.progress || {}), currentStreak: current, bestStreak: best };
  return state.progress;
}

function renderStreak() {
  const progress = calculateStreak();
  const next = STREAK_THRESHOLDS.find((threshold) => threshold > progress.currentStreak);
  elements.currentStreakValue.textContent = String(progress.currentStreak);
  elements.bestStreakLabel.textContent = `Record personal: ${progress.bestStreak || 0}`;
  if (!next) {
    elements.streakBar.style.width = "100%";
    elements.streakNextLabel.textContent = "Ai depasit toate pragurile disponibile.";
    return;
  }
  const previous = STREAK_THRESHOLDS.filter((threshold) => threshold < next).at(-1) || 0;
  const progressToNext = (progress.currentStreak - previous) / Math.max(1, next - previous);
  elements.streakBar.style.width = `${Math.max(0, Math.min(100, Math.round(progressToNext * 100)))}%`;
  elements.streakNextLabel.textContent = progress.currentStreak
    ? `Urmatorul prag: ${next}`
    : "Nu ai inca o serie activa.";
}

function challengeProgress(challenge) {
  const active = state.challenge;
  const start = active?.startDate || toKey(new Date());
  const end = active?.endDate || toKey(addDays(parseLocalDate(start), challenge.durationDays - 1));
  if (challenge.type === "completedWorkouts") return countCompleted({ start, end });
  if (challenge.type === "streak") return calculateStreak().currentStreak;
  if (challenge.type === "volume") return calculateTotalVolume({ start, end });
  if (challenge.type === "records") return personalRecords({ start, end }).length;
  return 0;
}

function renderChallenge() {
  const card = elements.challengeTitle.closest(".challenge-card");
  if (!hasPlanAccess(FEATURE_PLANS.challenge)) {
    setFeatureLocked(card, true);
    elements.challengeTitle.textContent = "Provocare activa";
    elements.challengeDescription.textContent = upgradeText(FEATURE_PLANS.challenge);
    elements.challengeBar.style.width = "0%";
    elements.challengeMeta.innerHTML = `<span>Plus</span><span>obiective avansate</span>`;
    elements.challengeButton.textContent = "Upgrade";
    elements.challengeButton.dataset.upgradePlan = FEATURE_PLANS.challenge;
    return;
  }
  setFeatureLocked(card, false);
  delete elements.challengeButton.dataset.upgradePlan;
  state.challenge = normalizeChallenge(state.challenge);
  if (!state.challenge?.challengeId) {
    elements.challengeTitle.textContent = "Incepe o provocare";
    elements.challengeDescription.textContent = "Alege un obiectiv si urmareste-ti progresul.";
    elements.challengeBar.style.width = "0%";
    elements.challengeMeta.innerHTML = `<span>o singura provocare activa</span>`;
    elements.challengeButton.textContent = "Alege provocarea";
    return;
  }
  const challenge = CHALLENGES.find((item) => item.id === state.challenge.challengeId);
  const value = challengeProgress(challenge);
  const daysLeft = Math.max(0, daysBetween(new Date(), parseLocalDate(state.challenge.endDate)));
  const completed = value >= challenge.target;
  state.challenge.currentValue = value;
  state.challenge.status = completed ? "finalizata" : state.challenge.endDate < toKey(new Date()) ? "expirata" : "activa";
  if (completed && !state.challenge.completedAt) state.challenge.completedAt = new Date().toISOString();
  elements.challengeTitle.textContent = challenge.title;
  elements.challengeDescription.textContent = challenge.description;
  elements.challengeBar.style.width = `${Math.min(100, Math.round((value / challenge.target) * 100))}%`;
  elements.challengeMeta.innerHTML = `
    <span>${formatMetric(value, challenge.type)} / ${formatMetric(challenge.target, challenge.type)}</span>
    <span>${completed ? "finalizata" : `${Math.max(0, challenge.target - value)} ramas`}</span>
    <span>${daysLeft} zile ramase</span>
  `;
  elements.challengeButton.textContent = "Vezi provocarea";
}

function openChallengeModal() {
  if (!hasPlanAccess(FEATURE_PLANS.challenge)) {
    showUpgradePrompt(FEATURE_PLANS.challenge);
    return;
  }
  state.challenge = normalizeChallenge(state.challenge);
  const activeChallenge = CHALLENGES.find((item) => item.id === state.challenge?.challengeId);
  elements.challengeList.innerHTML = CHALLENGES.map((challenge) => {
    const isActive = activeChallenge?.id === challenge.id;
    return `
      <article class="choice-card ${isActive ? "active" : ""}">
        <strong>${escapeHtml(challenge.title)}</strong>
        <span>${escapeHtml(challenge.description)}</span>
        <small>${challenge.target} tinta · ${challenge.durationDays} zile</small>
        <button class="secondary-button" data-challenge-id="${challenge.id}" type="button">${isActive ? "Abandoneaza" : "Porneste"}</button>
      </article>
    `;
  }).join("");
  openModal(elements.challengeModal);
}

function handleChallengeAction(event) {
  const button = event.target.closest("[data-challenge-id]");
  if (!button) return;
  const challengeId = button.dataset.challengeId;
  if (state.challenge?.challengeId === challengeId) {
    if (!window.confirm("Sigur vrei sa abandonezi provocarea activa?")) return;
    state.challenge = null;
    saveState();
    renderChallenge();
    closeModals();
    showToast("Provocare abandonata", "Poti alege alta provocare oricand.");
    return;
  }
  if (state.challenge?.challengeId && state.challenge.status === "activa") {
    showToast("Provocare activa", "Abandoneaza provocarea actuala inainte sa pornesti alta.");
    return;
  }
  const challenge = CHALLENGES.find((item) => item.id === challengeId);
  const startDate = toKey(new Date());
  state.challenge = {
    id: makeId("challenge"),
    challengeId,
    startDate,
    endDate: toKey(addDays(parseLocalDate(startDate), challenge.durationDays - 1)),
    currentValue: 0,
    status: "activa",
    completedAt: "",
  };
  saveState();
  renderChallenge();
  closeModals();
  showToast("Provocare pornita", challenge.title);
}

function renderAchievementCard() {
  const card = elements.achievementTitle.closest(".achievement-card");
  if (!hasPlanAccess(FEATURE_PLANS.achievements)) {
    setFeatureLocked(card, true);
    elements.achievementTitle.textContent = "Ultima realizare";
    elements.achievementSummary.innerHTML = `${escapeHtml(upgradeText(FEATURE_PLANS.achievements))}<br><button class="secondary-button inline-upgrade" data-upgrade-plan="${FEATURE_PLANS.achievements}" type="button">Upgrade la ${planLabel(FEATURE_PLANS.achievements)}</button>`;
    return;
  }
  setFeatureLocked(card, false);
  unlockAchievements();
  const unlocked = [...(state.achievements || [])].sort((a, b) => String(b.unlockedAt).localeCompare(String(a.unlockedAt)));
  const unseen = unlocked.find((item) => !item.seenAt);
  const current = unseen || unlocked[0];
  if (!current) {
    elements.achievementTitle.textContent = "Ultima realizare";
    elements.achievementSummary.textContent = "Realizarile se deblocheaza automat pe masura ce te antrenezi.";
    return;
  }
  const achievement = ACHIEVEMENTS.find((item) => item.id === current.achievementId);
  elements.achievementTitle.textContent = unseen ? "Realizare deblocata" : "Ultima realizare";
  elements.achievementSummary.textContent = unseen
    ? `${achievement.title}: ${achievement.description}`
    : `Ultima realizare: ${achievement.title}`;
}

function openAchievementsModal() {
  if (!hasPlanAccess(FEATURE_PLANS.achievements)) {
    showUpgradePrompt(FEATURE_PLANS.achievements);
    return;
  }
  unlockAchievements();
  const unlockedIds = new Set((state.achievements || []).map((item) => item.achievementId));
  elements.achievementsList.innerHTML = ACHIEVEMENTS.map((achievement) => {
    const userAchievement = (state.achievements || []).find((item) => item.achievementId === achievement.id);
    return `
      <article class="choice-card ${userAchievement ? "active" : ""}">
        <strong>${escapeHtml(achievement.title)}</strong>
        <span>${escapeHtml(achievement.description)}</span>
        <small>${userAchievement ? `Deblocata pe ${formatDateLong(toKey(new Date(userAchievement.unlockedAt)))}` : "Blocata"}</small>
      </article>
    `;
  }).join("");
  state.achievements = (state.achievements || []).map((item) => unlockedIds.has(item.achievementId) ? { ...item, seenAt: item.seenAt || new Date().toISOString(), isSeen: true } : item);
  saveState();
  openModal(elements.achievementsModal);
  renderAchievementCard();
}

function unlockAchievements() {
  state.achievements = Array.isArray(state.achievements) ? state.achievements : [];
  const existing = new Set(state.achievements.map((item) => item.achievementId));
  const stats = {
    completedWorkouts: countCompleted(),
    streak: calculateStreak().bestStreak || 0,
    volume: calculateTotalVolume(),
    records: personalRecords().length,
  };
  ACHIEVEMENTS.forEach((achievement) => {
    if (existing.has(achievement.id)) return;
    if ((stats[achievement.metric] || 0) >= achievement.threshold) {
      state.achievements.push({
        id: makeId("achievement"),
        achievementId: achievement.id,
        unlockedAt: new Date().toISOString(),
        seenAt: "",
        isSeen: false,
      });
    }
  });
}

function currentPlan() {
  if (isDeveloperAccount()) return { label: "Developer" };
  return PLAN_LIMITS[state.plan] || PLAN_LIMITS.free;
}

function isDeveloperAccount() {
  return DEVELOPER_EMAILS.has(String(state.user?.email || "").trim().toLowerCase());
}

function effectivePlan() {
  return isDeveloperAccount() ? "pro" : state.plan || "free";
}

function planRank(plan = effectivePlan()) {
  return { free: 0, plus: 1, pro: 2 }[plan] ?? 0;
}

function hasPlanAccess(minimumPlan) {
  return planRank(effectivePlan()) >= planRank(minimumPlan);
}

function planLabel(plan) {
  return PLAN_LIMITS[plan]?.label || plan;
}

function upgradeText(minimumPlan) {
  return `Optiune blocata. Pentru acces, faceti upgrade la planul ${planLabel(minimumPlan)}.`;
}

function lockedFeatureHtml(minimumPlan, detail = "") {
  return `
    <div class="premium-lock-panel">
      <strong>Blocat</strong>
      <span>${escapeHtml(detail || upgradeText(minimumPlan))}</span>
      <button class="secondary-button" data-upgrade-plan="${minimumPlan}" type="button">Upgrade la ${escapeHtml(planLabel(minimumPlan))}</button>
    </div>
  `;
}

function setFeatureLocked(container, locked) {
  container?.classList.toggle("premium-locked", Boolean(locked));
}

function showUpgradePrompt(minimumPlan) {
  showToast(`Disponibil in ${planLabel(minimumPlan)}`, upgradeText(minimumPlan));
  togglePlanOptions();
}

function renderPlans() {
  const plan = currentPlan();
  elements.currentPlanLabel.textContent = plan.label;
  const selectedPlan = isDeveloperAccount() ? "pro" : state.plan || "free";
  elements.planCards.forEach((card) => {
    card.classList.toggle("active", card.dataset.plan === selectedPlan);
  });
}

function togglePlanOptions() {
  openModal(elements.planOptions);
}

async function selectPlan(plan) {
  if (isDeveloperAccount()) {
    state.plan = PLAN_LIMITS[plan] ? plan : "pro";
    closeModals();
    saveState();
    renderAll();
    showToast("Acces developer", "Contul tau are acces complet la toate functiile.");
    return;
  }
  if (plan !== "free") {
    if (!currentSession) {
      showToast("Login necesar", "Conecteaza-te inainte sa faci upgrade.");
      return;
    }
    await createStripeCheckout(plan);
    return;
  }
  state.plan = PLAN_LIMITS[plan] ? plan : "free";
  closeModals();
  saveState();
  renderPlans();
  renderProgress();
  renderSubscription();
  showToast("Plan actualizat", `Ai selectat planul ${currentPlan().label}.`);
}

async function createStripeCheckout(plan) {
  const fallbackLink = PAYMENT_LINKS[plan];
  try {
    showToast("Se pregateste plata", `Deschid checkout-ul pentru ${planLabel(plan)}.`);
    const { data, error } = await supabaseClient.functions.invoke(STRIPE_CHECKOUT_FUNCTION, {
      body: { plan },
    });
    if (error) throw error;
    if (!data?.url) throw new Error("Checkout URL lipsa.");
    sessionStorage.setItem("fitpulse-pending-plan", plan);
    window.location.assign(data.url);
  } catch (error) {
    console.error("Stripe checkout failed", error);
    if (fallbackLink) {
      showToast("Checkout fallback", "Deschid linkul Stripe direct.");
      sessionStorage.setItem("fitpulse-pending-plan", plan);
      window.location.assign(fallbackLink);
      return;
    }
    showToast("Plata indisponibila", "Verifica setarile Stripe din Supabase.");
  }
}

function renderTrainingCalendar() {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();
  elements.monthLabel.textContent = `${MONTHS[month]} ${year}`;
  elements.bigCalendar.innerHTML = "";
  DAY_NAMES.forEach((name) => {
    const label = document.createElement("div");
    label.className = "calendar-label";
    label.textContent = name;
    elements.bigCalendar.appendChild(label);
  });

  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const gridStart = addDays(firstDay, -startOffset);

  for (let index = 0; index < 42; index += 1) {
    const date = addDays(gridStart, index);
    const key = toKey(date);
    const workout = state.workouts[key];
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "calendar-cell";
    cell.textContent = String(date.getDate());
    cell.classList.toggle("other", date.getMonth() !== month);
    cell.classList.toggle("selected", key === selectedDate);
    cell.classList.toggle("done", isWorkoutCompleted(workout));
    cell.classList.toggle("planned", Boolean(workout?.planned) && !isWorkoutCompleted(workout));
    if (workout?.planned || workout?.completed) {
      cell.classList.add("deletable");
      cell.title = "Dublu click pentru stergere";
    }
    cell.addEventListener("click", (event) => {
      if (handleWorkoutDeleteDoubleTap(event, key, workout)) return;
      selectedDate = key;
      renderTrainingCalendar();
      renderSelectedWorkout();
    });
    elements.bigCalendar.appendChild(cell);
  }
}

function handleWorkoutDeleteDoubleTap(event, key, workout) {
  if (!workout?.planned && !workout?.completed) {
    lastCalendarTap = { key: "", time: 0 };
    return false;
  }
  const now = Date.now();
  const isDoubleTap = lastCalendarTap.key === key && now - lastCalendarTap.time <= CALENDAR_DOUBLE_TAP_MS;
  lastCalendarTap = { key, time: now };
  if (!isDoubleTap) return false;
  event.preventDefault();
  lastCalendarTap = { key: "", time: 0 };
  openDeleteWorkoutConfirm(key);
  return true;
}

function openDeleteWorkoutConfirm(dateKey) {
  const workout = state.workouts[dateKey];
  if (!workout?.planned && !workout?.completed) return;
  pendingWorkoutDeleteDate = dateKey;
  elements.deleteWorkoutMessage.textContent = `Vrei sa stergi antrenamentul de pe data ${formatDateLong(dateKey)}?`;
  openModal(elements.deleteWorkoutModal);
}

function confirmDeleteWorkout() {
  if (!pendingWorkoutDeleteDate) return;
  const deletedDate = pendingWorkoutDeleteDate;
  const activeOnDate = state.activeWorkout?.status === "active" && state.activeWorkout?.workoutDate === deletedDate;
  delete state.workouts[deletedDate];
  if (activeOnDate) {
    state.activeWorkout = null;
    stopRestTimer();
  }
  if (selectedDate === deletedDate) {
    selectedDate = toKey(new Date());
    visibleMonth = parseLocalDate(selectedDate);
  }
  pendingWorkoutDeleteDate = "";
  closeModals();
  saveState();
  renderAll();
  showToast("Antrenament sters", `Am sters ziua ${formatDateLong(deletedDate)}.`);
}

function renderSelectedWorkout() {
  const workout = state.workouts[selectedDate] || {};
  elements.selectedDateLabel.textContent = formatDateLong(selectedDate);
  elements.focusInput.value = workout.focus || "Piept si triceps";
  elements.exerciseInput.value = workout.exercises || "";
  updateWorkoutSubmitLabel();
}

function updateWorkoutSubmitLabel() {
  elements.workoutSubmitButton.textContent = elements.exerciseInput.value.trim() ? "Salveaza ziua" : "Genereaza ziua";
}

function renderTrainingSummary() {
  const entries = Object.entries(state.workouts)
    .filter(([, workout]) => workout?.planned || workout?.completed)
    .sort(([dateA], [dateB]) => dateB.localeCompare(dateA));

  elements.trainingCompletedTotal.textContent = String(countCompleted());
  if (!entries.length) {
    elements.workoutHistory.innerHTML = `<p class="empty-history">Nu ai inca antrenamente salvate.</p>`;
    return;
  }

  elements.workoutHistory.innerHTML = entries
    .map(([date, workout]) => {
      const exercises = (workout.exercises || "")
        .split("\n")
        .filter(Boolean)
        .map((line) => `<li>${escapeHtml(line)}</li>`)
        .join("");
      return `
        <article class="history-item">
          <div>
            <strong>${formatDateLong(date)}</strong>
            <span>${escapeHtml(workout.focus || "Antrenament")}</span>
          </div>
          <em>${isWorkoutCompleted(workout) ? "Bifat" : "Planificat"}</em>
          ${exercises ? `<ul>${exercises}</ul>` : ""}
        </article>
      `;
    })
    .join("");
}

function saveWorkout(event) {
  event.preventDefault();
  const previous = state.workouts[selectedDate] || {};
  const focus = elements.focusInput.value;
  const manualExercises = elements.exerciseInput.value.trim();
  const generatedPlan = manualExercises
    ? { exercises: manualExercises, exercisePrescriptions: previous.exercisePrescriptions || {} }
    : buildGeneratedWorkoutPlan(generateExercisesForFocus(focus));
  const exerciseChecks = syncExerciseChecks(generatedPlan.exercises, previous.exerciseChecks);
  const exerciseLines = parseExerciseLines(generatedPlan.exercises);
  state.workouts[selectedDate] = {
    ...previous,
    planned: true,
    focus,
    exercises: generatedPlan.exercises,
    exercisePrescriptions: generatedPlan.exercisePrescriptions,
    exerciseChecks,
    completed: exerciseLines.length > 0 && exerciseLines.every((line) => exerciseChecks[line]),
  };
  saveState();
  renderAll();
  showToast(
    manualExercises ? "Antrenament salvat" : "Exercitii generate",
    manualExercises
      ? `${formatDateLong(selectedDate)} a fost actualizata.`
      : `Am folosit aparatele din sala pentru ${focus.toLowerCase()}.`,
  );
}

function startWorkout() {
  if (!hasPlanAccess(FEATURE_PLANS.activeWorkout)) {
    showUpgradePrompt(FEATURE_PLANS.activeWorkout);
    return;
  }
  const active = state.activeWorkout;
  if (active?.status === "active") {
    showToast("Antrenament activ", "Finalizeaza-l din butonul de jos.");
    return;
  }
  prepareTimerAudio();
  const workout = state.workouts[selectedDate];
  if (!workout?.planned) {
    showToast("Fara antrenament", "Salveaza mai intai exercitiile pentru ziua selectata.");
    return;
  }
  const exercises = parseExerciseLines(workout.exercises);
  if (!exercises.length) {
    showToast("Fara exercitii", "Adauga exercitii inainte sa pornesti antrenamentul.");
    return;
  }
  state.activeWorkout = {
    id: makeId("session"),
    workoutDate: selectedDate,
    focus: workout.focus || "Antrenament",
    startedAt: new Date().toISOString(),
    endedAt: "",
    status: "active",
    rest: null,
    exercises: exercises.map((name, index) => ({
      id: exerciseIdFromName(name),
      name,
      group: muscleGroupForExercise(name).primary,
      skipped: false,
      permanentNote: state.exerciseNotes?.[exerciseIdFromName(name)]?.permanent || "",
      sessionNote: "",
      sets: presetSetsForExercise(workout.exercisePrescriptions?.[name]),
      order: index + 1,
    })),
  };
  saveState();
  renderActiveWorkout();
  showToast("Antrenament pornit", "Seturile se salveaza imediat in aplicatie.");
}

function renderActiveWorkout() {
  const card = elements.activeWorkoutCard;
  if (!hasPlanAccess(FEATURE_PLANS.activeWorkout)) {
    setFeatureLocked(card, true);
    elements.startWorkoutButton.textContent = "Upgrade";
    elements.startWorkoutButton.disabled = false;
    elements.startWorkoutButton.dataset.upgradePlan = FEATURE_PLANS.activeWorkout;
    elements.activeWorkoutSummary.innerHTML = lockedFeatureHtml(
      FEATURE_PLANS.activeWorkout,
      "Antrenamentul activ, seturile, timerul de pauza si recordurile personale sunt incluse in Pro.",
    );
    elements.activeWorkoutBody.innerHTML = "";
    elements.finishWorkoutButton.classList.add("hidden");
    elements.restTimerBar.classList.add("hidden");
    return;
  }
  setFeatureLocked(card, false);
  delete elements.startWorkoutButton.dataset.upgradePlan;
  const active = state.activeWorkout;
  if (!active || active.status !== "active") {
    elements.startWorkoutButton.textContent = "Porneste";
    elements.startWorkoutButton.disabled = false;
    elements.activeWorkoutSummary.textContent = "Porneste ziua selectata ca sa notezi seturi, pauze si recorduri.";
    elements.activeWorkoutBody.innerHTML = "";
    elements.finishWorkoutButton.classList.add("hidden");
    elements.restTimerBar.classList.add("hidden");
    return;
  }
  const duration = elapsedSeconds(active.startedAt);
  const totals = activeWorkoutTotals(active);
  elements.startWorkoutButton.textContent = "Pornit";
  elements.startWorkoutButton.disabled = true;
  elements.activeWorkoutSummary.innerHTML = `
    <strong>${escapeHtml(active.focus)}</strong>
    <span>${formatDateLong(active.workoutDate)} · Durata: ${formatDuration(duration)} · Exercitii: ${totals.completedExercises}/${active.exercises.length} · Volum: ${formatKg(totals.volume)}</span>
  `;
  elements.activeWorkoutBody.innerHTML = active.exercises.map((exercise, exerciseIndex) => `
    <article class="active-exercise ${exercise.skipped ? "skipped" : ""}" data-exercise-index="${exerciseIndex}">
      <div class="section-head">
        <div>
          <strong>${escapeHtml(exercise.name)}</strong>
          <small>${escapeHtml(exercise.group || "grupa neatribuita")}</small>
        </div>
        <button class="text-button" data-action="skip-exercise" type="button">${exercise.skipped ? "Reia" : "Sari"}</button>
      </div>
      ${exercise.permanentNote ? `<p class="compact-note">Nota permanenta: ${escapeHtml(exercise.permanentNote)}</p>` : ""}
      <div class="sets-table">
        <span>Set</span><span>Kg</span><span>Repetari</span><span></span>
        ${exercise.sets.map((set, setIndex) => `
          <strong>${setIndex + 1}</strong>
          <input data-action="set-weight" data-set-index="${setIndex}" type="number" min="0" step="0.5" value="${escapeHtml(set.weight || "")}" />
          <input data-action="set-reps" data-set-index="${setIndex}" type="number" min="1" step="1" value="${escapeHtml(set.reps || "")}" />
          <button class="text-button ${set.completed ? "active" : ""}" data-action="complete-set" data-set-index="${setIndex}" type="button">${set.completed ? "Editat" : "Finalizeaza"}</button>
        `).join("")}
      </div>
      <textarea data-action="session-note" rows="2" placeholder="Observatie pentru sesiune">${escapeHtml(exercise.sessionNote || "")}</textarea>
      <div class="quick-actions">
        <button class="secondary-button" data-action="add-set" type="button">Adauga set</button>
        <button class="secondary-button" data-action="save-note" type="button">Salveaza nota</button>
      </div>
    </article>
  `).join("");
  elements.finishWorkoutButton.classList.remove("hidden");
  tickRestTimer();
}

function handleActiveWorkoutClick(event) {
  const card = event.target.closest(".active-exercise");
  if (!card || !state.activeWorkout) return;
  const exerciseIndex = Number(card.dataset.exerciseIndex);
  const exercise = state.activeWorkout.exercises[exerciseIndex];
  const action = event.target.dataset.action;
  if (!exercise || !action) return;
  if (action === "skip-exercise") {
    exercise.skipped = !exercise.skipped;
    saveState();
    renderActiveWorkout();
    return;
  }
  if (action === "add-set") {
    exercise.sets.push(emptySet(exercise.sets.length + 1));
    saveState();
    renderActiveWorkout();
    return;
  }
  if (action === "save-note") {
    const note = card.querySelector("[data-action='session-note']").value.trim();
    exercise.sessionNote = note;
    saveState();
    showToast("Nota salvata", "Observatia pentru exercitiu a fost actualizata.");
    return;
  }
  if (action === "complete-set") {
    const setIndex = Number(event.target.dataset.setIndex);
    const set = exercise.sets[setIndex];
    const weight = Number(card.querySelector(`[data-action="set-weight"][data-set-index="${setIndex}"]`).value);
    const reps = Number(card.querySelector(`[data-action="set-reps"][data-set-index="${setIndex}"]`).value);
    if (!Number.isFinite(weight) || weight < 0 || !Number.isInteger(reps) || reps <= 0) {
      showToast("Set invalid", "Greutatea trebuie sa fie pozitiva, iar repetarile numar intreg.");
      return;
    }
    set.weight = weight;
    set.reps = reps;
    set.completed = true;
    set.completedAt = new Date().toISOString();
    set.volume = weight > 0 ? weight * reps : 0;
    detectPersonalRecords(exercise, set);
    prepareTimerAudio();
    startRestTimer(defaultRestSeconds(exercise.name));
    saveState();
    renderActiveWorkout();
    showToast("Set finalizat", `${exercise.name}: ${weight} kg x ${reps}`);
  }
}

function handleActiveWorkoutInput(event) {
  const card = event.target.closest(".active-exercise");
  if (!card || !state.activeWorkout) return;
  const exerciseIndex = Number(card.dataset.exerciseIndex);
  const exercise = state.activeWorkout.exercises?.[exerciseIndex];
  const action = event.target.dataset.action;
  if (!exercise || !action) return;
  if (action === "session-note") {
    exercise.sessionNote = event.target.value;
    saveState();
    return;
  }
  if (!["set-weight", "set-reps"].includes(action)) return;
  const setIndex = Number(event.target.dataset.setIndex);
  const set = exercise.sets?.[setIndex];
  if (!set) return;
  if (action === "set-weight") set.weight = event.target.value;
  if (action === "set-reps") set.reps = event.target.value;
  if (set.completed) {
    const weight = Number(set.weight);
    const reps = Number(set.reps);
    set.volume = Number.isFinite(weight) && Number.isFinite(reps) && weight > 0 && reps > 0 ? weight * reps : 0;
  }
  saveState();
}

function finishActiveWorkout() {
  const active = state.activeWorkout;
  if (!active || active.status !== "active") return;
  const totals = activeWorkoutTotals(active);
  active.status = "completed";
  active.endedAt = new Date().toISOString();
  active.durationSeconds = elapsedSeconds(active.startedAt);
  active.totalVolume = totals.volume;
  state.sessions = Array.isArray(state.sessions) ? state.sessions : [];
  state.sessions.push(active);
  const workout = state.workouts[active.workoutDate] || {};
  const exerciseChecks = {};
  parseExerciseLines(workout.exercises).forEach((line) => {
    exerciseChecks[line] = true;
  });
  state.workouts[active.workoutDate] = { ...workout, completed: true, exerciseChecks };
  state.activeWorkout = null;
  stopRestTimer();
  saveState();
  renderAll();
  showToast("Antrenament salvat", `${formatKg(totals.volume)} volum · ${totals.completedSets} seturi finalizate.`);
}

function emptySet(number) {
  return { id: makeId("set"), setNumber: number, weight: "", reps: "", completed: false, isWarmup: false, volume: 0, completedAt: "" };
}

function presetSetsForExercise(prescription = null) {
  const setCount = Math.max(1, Math.min(8, Number(prescription?.sets || 1)));
  const targetReps = prescription?.reps ? String(prescription.reps) : "";
  return Array.from({ length: setCount }, (_, index) => ({
    ...emptySet(index + 1),
    reps: targetReps,
  }));
}

function activeWorkoutTotals(active) {
  const sets = active.exercises.flatMap((exercise) => exercise.skipped ? [] : exercise.sets);
  const completedSets = sets.filter((set) => set.completed && !set.isWarmup);
  const volume = completedSets.reduce((sum, set) => sum + Number(set.volume || 0), 0);
  const completedExercises = active.exercises.filter((exercise) => !exercise.skipped && exercise.sets.some((set) => set.completed)).length;
  return { completedSets: completedSets.length, completedExercises, volume };
}

function startRestTimer(seconds) {
  state.activeWorkout.rest = {
    durationSeconds: seconds,
    endsAt: new Date(Date.now() + seconds * 1000).toISOString(),
    paused: false,
    remainingSeconds: seconds,
  };
  saveState();
  tickRestTimer();
}

function tickRestTimer() {
  window.clearInterval(restTimerInterval);
  const rest = state.activeWorkout?.rest;
  if (!rest || state.activeWorkout?.status !== "active") {
    elements.restTimerBar?.classList.add("hidden");
    return;
  }
  const update = () => {
    const currentRest = state.activeWorkout?.rest;
    if (!currentRest) {
      elements.restTimerBar.classList.add("hidden");
      window.clearInterval(restTimerInterval);
      return;
    }
    const remaining = currentRest.paused
      ? Number(currentRest.remainingSeconds || 0)
      : Math.max(0, Math.ceil((new Date(currentRest.endsAt) - new Date()) / 1000));
    elements.restTimerBar.classList.toggle("hidden", remaining <= 0);
    elements.restTimerValue.textContent = formatDuration(remaining);
    elements.pauseRestButton.textContent = currentRest.paused ? "Continua" : "Pauza";
    if (remaining <= 0) {
      stopRestTimer();
      playTimerBeep();
      navigator.vibrate?.(180);
      showToast("Pauza gata", "Poti incepe urmatorul set.");
    }
  };
  update();
  restTimerInterval = window.setInterval(update, 1000);
}

function adjustRestTimer(seconds) {
  const rest = state.activeWorkout?.rest;
  if (!rest) return;
  const remaining = Math.max(0, Math.ceil((new Date(rest.endsAt) - new Date()) / 1000));
  rest.endsAt = new Date(Date.now() + (remaining + seconds) * 1000).toISOString();
  rest.paused = false;
  saveState();
  tickRestTimer();
}

function toggleRestPause() {
  const rest = state.activeWorkout?.rest;
  if (!rest) return;
  if (rest.paused) {
    rest.endsAt = new Date(Date.now() + Number(rest.remainingSeconds || 0) * 1000).toISOString();
    rest.paused = false;
  } else {
    rest.remainingSeconds = Math.max(0, Math.ceil((new Date(rest.endsAt) - new Date()) / 1000));
    rest.paused = true;
  }
  saveState();
  tickRestTimer();
}

function stopRestTimer() {
  if (state.activeWorkout?.rest) state.activeWorkout.rest = null;
  saveState();
  elements.restTimerBar?.classList.add("hidden");
}

function prepareTimerAudio() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioContext = audioContext || new AudioContext();
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
  } catch (error) {
    console.warn("Timer audio unavailable", error);
  }
}

function playTimerBeep() {
  if (!normalizedSettings().sound) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    audioContext = audioContext || new AudioContext();
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
    const startTone = (frequency, delay, duration) => {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime + delay);
      gain.gain.setValueAtTime(0.0001, audioContext.currentTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.14, audioContext.currentTime + delay + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + delay + duration);
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start(audioContext.currentTime + delay);
      oscillator.stop(audioContext.currentTime + delay + duration + 0.02);
    };
    startTone(880, 0, 0.16);
    startTone(1046, 0.2, 0.18);
  } catch (error) {
    console.warn("Timer beep unavailable", error);
  }
}

function handleExerciseToggle(event) {
  const button = event.target.closest(".exercise-check");
  if (!button) return;
  const workout = state.workouts[homeSelectedDate];
  if (!workout?.planned) return;

  const exercise = button.dataset.exercise;
  const exerciseChecks = { ...(workout.exerciseChecks || {}) };
  exerciseChecks[exercise] = !exerciseChecks[exercise];
  const exerciseLines = parseExerciseLines(workout.exercises);
  const completed = exerciseLines.length > 0 && exerciseLines.every((line) => exerciseChecks[line]);
  state.workouts[homeSelectedDate] = {
    ...workout,
    exerciseChecks,
    completed,
  };
  saveState();
  renderAll();
  showToast(
    completed ? "Zi completata" : exerciseChecks[exercise] ? "Exercitiu bifat" : "Exercitiu debifat",
    completed ? "Ai bifat toate exercitiile, ziua a fost marcata automat." : exercise,
  );
}

function toggleWorkout(key) {
  const workout = state.workouts[key] || {
    planned: true,
    focus: "Full body",
    exercises: defaultExercises("Full body").join("\n"),
  };
  state.workouts[key] = { ...workout, completed: !workout.completed };
  saveState();
  renderAll();
  showToast(
    state.workouts[key].completed ? "Zi bifata" : "Zi debifata",
    state.workouts[key].completed ? "Antrenamentul a fost marcat ca facut." : "Marcajul a fost scos.",
  );
}

function makeId(prefix) {
  if (window.crypto?.randomUUID) return `${prefix}-${window.crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function renderProgress() {
  if (progressMode === "year" && !hasPlanAccess(FEATURE_PLANS.progressYear)) {
    progressMode = "30";
  }
  const range = progressRangeForMode(progressMode);
  const workouts = workoutEntriesInRange(range.start, range.end);
  const completed = countCompleted(range);
  elements.statCompleted.textContent = String(completed);
  elements.statVolume.textContent = formatKg(calculateTotalVolume(range));
  elements.statRecords.textContent = hasPlanAccess(FEATURE_PLANS.records) ? String(personalRecords(range).length) : "Pro";
  elements.progressRange.textContent = progressMode === "year" ? `Anul ${range.year}` : progressRangeLabel(progressMode);
  elements.progressModeButtons.forEach((button) => {
    const locked = button.dataset.progressMode === "year" && !hasPlanAccess(FEATURE_PLANS.progressYear);
    button.classList.toggle("active", button.dataset.progressMode === progressMode);
    button.classList.toggle("locked", locked);
    if (locked) button.dataset.upgradePlan = FEATURE_PLANS.progressYear;
    else delete button.dataset.upgradePlan;
  });
  drawChart(range);
  renderVolumeSummary(range);
  renderMuscleMap(range);
  renderProgressPhotos();
  void workouts;
}

function drawChart(range = progressRangeForMode("30")) {
  const canvas = elements.progressChart;
  const context = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  context.clearRect(0, 0, width, height);
  const isLightTheme = document.body.dataset.theme === "light";
  const chartBg = isLightTheme ? "#ffffff" : "#070907";
  const accentColor = isLightTheme ? "#050505" : "#ffffff";
  const accentSoft = isLightTheme ? "rgba(0, 0, 0, 0.42)" : "rgba(255, 255, 255, 0.42)";
  const accentFill = isLightTheme ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.16)";
  const emptyFill = isLightTheme ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.1)";
  const gridColor = isLightTheme ? "rgba(0, 0, 0, 0.13)" : "rgba(255, 255, 255, 0.13)";
  const pointStroke = isLightTheme ? "#ffffff" : "#f7fff4";
  context.fillStyle = chartBg;
  context.fillRect(0, 0, width, height);

  const buckets = range.buckets || range.days.map((date) => ({ start: toKey(date), end: toKey(date), label: formatDateShort(toKey(date)) }));
  const values = buckets.map(({ start, end }) => countCompleted({ start, end }));
  const maxValue = Math.max(1, ...values);
  const padding = 44;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  context.strokeStyle = gridColor;
  context.lineWidth = 2;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding + (graphHeight / 4) * i;
    context.beginPath();
    context.moveTo(padding, y);
    context.lineTo(width - padding, y);
    context.stroke();
  }

  context.fillStyle = accentSoft;
  context.font = "700 18px Inter, sans-serif";
  context.fillText(String(maxValue), 13, padding + 6);
  context.fillText("0", 24, padding + graphHeight + 6);

  const points = values.map((value, index) => {
    const x = padding + (graphWidth / Math.max(1, values.length - 1)) * index;
    const y = padding + graphHeight - (value / maxValue) * graphHeight * 0.78;
    return { x, y, value, bucket: buckets[index] };
  });

  if (points.length) {
    const gradient = context.createLinearGradient(0, padding, 0, padding + graphHeight);
    gradient.addColorStop(0, accentFill);
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    context.beginPath();
    context.moveTo(points[0].x, padding + graphHeight);
    points.forEach((point) => context.lineTo(point.x, point.y));
    context.lineTo(points.at(-1).x, padding + graphHeight);
    context.closePath();
    context.fillStyle = gradient;
    context.fill();

    context.beginPath();
    points.forEach((point, index) => {
      if (index === 0) context.moveTo(point.x, point.y);
      else context.lineTo(point.x, point.y);
    });
    context.strokeStyle = accentColor;
    context.lineWidth = 5;
    context.lineJoin = "round";
    context.lineCap = "round";
    context.stroke();
  }

  points.forEach((point) => {
    context.fillStyle = point.value ? accentColor : chartBg;
    context.strokeStyle = point.value ? pointStroke : accentSoft;
    context.lineWidth = 4;
    context.beginPath();
    context.arc(point.x, point.y, point.value ? 8 : 6, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  });

  chartPoints = points.map((point) => ({
    x: point.x,
    y: point.y,
    label: point.bucket.label,
    valueText: `${point.value} antrenamente finalizate`,
  }));
}

function setProgressMode(mode) {
  if (mode === "year" && !hasPlanAccess(FEATURE_PLANS.progressYear)) {
    showUpgradePrompt(FEATURE_PLANS.progressYear);
    return;
  }
  progressMode = ["30", "year"].includes(mode) ? mode : "30";
  renderProgress();
}

function progressRangeForMode(mode) {
  if (mode === "year") {
    const year = new Date().getFullYear();
    return {
      year,
      start: `${year}-01-01`,
      end: `${year}-12-31`,
      buckets: Array.from({ length: 12 }, (_, month) => ({
        start: `${year}-${String(month + 1).padStart(2, "0")}-01`,
        end: toKey(new Date(year, month + 1, 0)),
        label: `${MONTHS[month]} ${year}`,
      })),
    };
  }
  const days = 30;
  const base = recentDaysRange(days);
  base.buckets = base.days.map((date) => {
    const key = toKey(date);
    return { start: key, end: key, label: formatDateLong(key) };
  });
  return base;
}

function progressRangeLabel(mode) {
  return "Ultimele 30 de zile";
}

function calculateTotalVolume(range = null) {
  return completedSets(range).reduce((sum, item) => sum + Number(item.set.volume || 0), 0);
}

function completedSets(range = null) {
  const sessions = Array.isArray(state.sessions) ? state.sessions : [];
  return sessions
    .filter((session) => session.status === "completed" && (!range || dateInRange(session.workoutDate, range.start, range.end)))
    .flatMap((session) => session.exercises.flatMap((exercise) => (
      exercise.skipped ? [] : exercise.sets
        .filter((set) => set.completed && !set.isWarmup && Number(set.weight) > 0)
        .map((set) => ({ session, exercise, set }))
    )));
}

function personalRecords(range = null) {
  const records = Array.isArray(state.personalRecords) ? state.personalRecords : [];
  return records.filter((record) => !range || dateInRange(toKey(new Date(record.achievedAt)), range.start, range.end));
}

function detectPersonalRecords(exercise, set) {
  if (!set.completed || set.isWarmup || Number(set.weight) <= 0) return;
  state.personalRecords = Array.isArray(state.personalRecords) ? state.personalRecords : [];
  const candidates = [
    { type: "greutate", value: Number(set.weight) },
    { type: "volum set", value: Number(set.volume || 0) },
  ];
  if (Number(set.reps) >= 1 && Number(set.reps) <= 15) {
    candidates.push({ type: "1RM estimat", value: Number(set.weight) * (1 + Number(set.reps) / 30) });
  }
  candidates.forEach((candidate) => {
    const previousBest = state.personalRecords
      .filter((record) => record.exerciseId === exercise.id && record.type === candidate.type)
      .reduce((best, record) => Math.max(best, Number(record.newValue || 0)), 0);
    if (candidate.value <= previousBest) return;
    const duplicate = state.personalRecords.some((record) => record.setId === set.id && record.type === candidate.type);
    if (duplicate) return;
    state.personalRecords.push({
      id: makeId("record"),
      exerciseId: exercise.id,
      workoutId: state.activeWorkout?.id || "",
      setId: set.id,
      type: candidate.type,
      previousValue: previousBest,
      newValue: Math.round(candidate.value * 10) / 10,
      achievedAt: new Date().toISOString(),
    });
    showToast("Record personal nou", `${exercise.name}: ${Math.round(candidate.value * 10) / 10}`);
  });
}

function renderVolumeSummary(range) {
  const card = elements.volumeSummary.closest(".volume-card");
  if (!hasPlanAccess(FEATURE_PLANS.volume)) {
    setFeatureLocked(card, true);
    elements.volumeFilter.disabled = true;
    elements.volumeSummary.innerHTML = lockedFeatureHtml(
      FEATURE_PLANS.volume,
      "Volumul ridicat, comparatiile si media per antrenament sunt incluse in Plus si Pro.",
    );
    return;
  }
  setFeatureLocked(card, false);
  elements.volumeFilter.disabled = true;
  const total = calculateTotalVolume();
  const allSets = completedSets();
  const sessions = (Array.isArray(state.sessions) ? state.sessions : []).filter((session) => session.status === "completed");
  const completed = sessions.length;
  const firstDate = sessions.map((session) => session.workoutDate).sort()[0] || "";
  const average = completed ? Math.round(total / completed) : 0;
  const bestSession = sessions
    .map((session) => ({ session, total: activeWorkoutTotals(session).volume || Number(session.totalVolume || 0) }))
    .sort((a, b) => b.total - a.total)[0];
  elements.volumeSummary.innerHTML = `
    <div class="macro-row"><strong>Volum total</strong><span>${formatKg(total)}</span></div>
    <div class="macro-row"><strong>De la primul antrenament</strong><span>${firstDate ? formatDateLong(firstDate) : "Nu exista antrenamente finalizate."}</span></div>
    <div class="macro-row"><strong>Seturi finalizate</strong><span>${allSets.length}</span></div>
    <div class="macro-row"><strong>Media per antrenament</strong><span>${formatKg(average)}</span></div>
    <div class="macro-row"><strong>Cel mai mare volum intr-o zi</strong><span>${bestSession ? `${formatKg(bestSession.total)} · ${formatDateLong(bestSession.session.workoutDate)}` : "Fara date suficiente."}</span></div>
  `;
  void range;
}

function previousRange(range) {
  const start = parseLocalDate(range.start);
  const end = parseLocalDate(range.end);
  const length = daysBetween(start, end) + 1;
  const previousEnd = addDays(start, -1);
  const previousStart = addDays(previousEnd, -(length - 1));
  return { start: toKey(previousStart), end: toKey(previousEnd) };
}

function setMuscleView(view) {
  if (!hasPlanAccess(FEATURE_PLANS.muscleMap)) {
    showUpgradePrompt(FEATURE_PLANS.muscleMap);
    return;
  }
  muscleView = view === "back" ? "back" : "front";
  elements.muscleViewButtons.forEach((button) => button.classList.toggle("active", button.dataset.muscleView === muscleView));
  renderMuscleMap(progressRangeForMode(progressMode));
}

function renderMuscleMap(range) {
  const card = elements.muscleMap.closest(".muscle-map-card");
  if (!hasPlanAccess(FEATURE_PLANS.muscleMap)) {
    setFeatureLocked(card, true);
    elements.muscleViewButtons.forEach((button) => {
      button.disabled = true;
      button.dataset.upgradePlan = FEATURE_PLANS.muscleMap;
    });
    elements.muscleMap.innerHTML = lockedFeatureHtml(
      FEATURE_PLANS.muscleMap,
      "Harta musculara si analiza pe grupe sunt disponibile in Pro.",
    );
    return;
  }
  setFeatureLocked(card, false);
  elements.muscleViewButtons.forEach((button) => {
    button.disabled = false;
    delete button.dataset.upgradePlan;
  });
  const stats = muscleStats(range);
  const groups = muscleView === "back"
    ? ["trapez", "umar posterior", "triceps", "dorsal", "lombari", "fesieri", "biceps femural", "gambe"]
    : ["piept", "umar anterior", "biceps", "antebrat", "abdomen", "oblici", "cvadriceps", "adductori", "gambe"];
  elements.muscleMap.innerHTML = `
    <div class="muscle-figure ${muscleView}">
      ${groups.map((group) => {
        const value = stats[group]?.setsPrimary || 0;
        const level = value >= 12 ? "high" : value >= 6 ? "mid" : value > 0 ? "low" : "none";
        return `<button class="muscle-zone ${level} ${classNameSafe(group)}" data-muscle="${escapeHtml(group)}" type="button">${escapeHtml(group)}</button>`;
      }).join("")}
    </div>
  `;
}

function openMuscleDetails(event) {
  if (!hasPlanAccess(FEATURE_PLANS.muscleMap)) {
    showUpgradePrompt(FEATURE_PLANS.muscleMap);
    return;
  }
  const button = event.target.closest("[data-muscle]");
  if (!button) return;
  const group = button.dataset.muscle;
  const stats = muscleStats(progressRangeForMode(progressMode))[group] || emptyMuscleStats();
  elements.muscleModalTitle.textContent = capitalize(group);
  elements.muscleDetails.innerHTML = `
    <div class="macro-row"><strong>Seturi principale</strong><span>${stats.setsPrimary}</span></div>
    <div class="macro-row"><strong>Seturi secundare</strong><span>${stats.setsSecondary}</span></div>
    <div class="macro-row"><strong>Antrenamente</strong><span>${stats.workouts}</span></div>
    <div class="macro-row"><strong>Volum total</strong><span>${formatKg(stats.volume)}</span></div>
    <div class="macro-row"><strong>Ultima antrenare</strong><span>${stats.lastDate ? formatDateLong(stats.lastDate) : "fara date"}</span></div>
    <div class="macro-row"><strong>Exercitii principale</strong><span>${escapeHtml([...stats.exercises].slice(0, 5).join(", ") || "fara exercitii")}</span></div>
  `;
  openModal(elements.muscleModal);
}

function muscleStats(range = null) {
  const stats = {};
  completedSets(range).forEach(({ session, exercise, set }) => {
    const mapping = muscleGroupForExercise(exercise.name);
    stats[mapping.primary] = stats[mapping.primary] || emptyMuscleStats();
    stats[mapping.primary].setsPrimary += 1;
    stats[mapping.primary].volume += Number(set.volume || 0);
    stats[mapping.primary].workoutDates.add(session.workoutDate);
    stats[mapping.primary].workouts = stats[mapping.primary].workoutDates.size;
    stats[mapping.primary].lastDate = !stats[mapping.primary].lastDate || session.workoutDate > stats[mapping.primary].lastDate ? session.workoutDate : stats[mapping.primary].lastDate;
    stats[mapping.primary].exercises.add(exercise.name);
    mapping.secondary.forEach((group) => {
      stats[group] = stats[group] || emptyMuscleStats();
      stats[group].setsSecondary += 1;
      stats[group].workoutDates.add(session.workoutDate);
      stats[group].workouts = stats[group].workoutDates.size;
      stats[group].lastDate = !stats[group].lastDate || session.workoutDate > stats[group].lastDate ? session.workoutDate : stats[group].lastDate;
      stats[group].exercises.add(exercise.name);
    });
  });
  return stats;
}

function emptyMuscleStats() {
  return { setsPrimary: 0, setsSecondary: 0, workouts: 0, volume: 0, lastDate: "", exercises: new Set(), workoutDates: new Set() };
}

async function saveProgressPhoto(event) {
  if (!hasPlanAccess(FEATURE_PLANS.progressPhotos)) {
    elements.progressPhotoInput.value = "";
    showUpgradePrompt(FEATURE_PLANS.progressPhotos);
    return;
  }
  const file = event.target.files?.[0];
  if (!file) return;
  const date = elements.progressPhotoDate.value || toKey(new Date());
  showToast("Se salveaza poza", "Fotografia este optimizata pentru sincronizare.");
  try {
    const image = await compressImageFile(file);
    state.progressPhotos = Array.isArray(state.progressPhotos) ? state.progressPhotos : [];
    state.progressPhotos.unshift({
      id: makeId("photo"),
      date,
      angle: "progres",
      image,
      weight: state.user?.profile?.weight || "",
      note: "",
      createdAt: new Date().toISOString(),
    });
    saveState();
    renderProgressPhotos();
    showToast("Fotografie salvata", "Fotografia de progres a fost adaugata si sincronizarea a pornit.");
  } catch (error) {
    console.error("Progress photo save failed", error);
    showToast("Poza nesalvata", "Incearca o fotografie mai mica sau refa incarcarea.");
  } finally {
    elements.progressPhotoInput.value = "";
  }
}

function compressImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error("Nu s-a putut citi poza."));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => resolve(reader.result);
      image.onload = () => {
        const ratio = Math.min(1, MAX_PROGRESS_PHOTO_SIZE / Math.max(image.width, image.height));
        const width = Math.max(1, Math.round(image.width * ratio));
        const height = Math.max(1, Math.round(image.height * ratio));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
          resolve(reader.result);
          return;
        }
        context.drawImage(image, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", PROGRESS_PHOTO_QUALITY));
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function progressPhotoPayload(photo) {
  return {
    ...photo,
    image: photo.image || "",
  };
}

function compactProgressPhotoPayload(photo) {
  const { image, ...payload } = photo || {};
  void image;
  return payload;
}

function isPayloadSizeError(error) {
  const message = `${error?.message || ""} ${error?.details || ""}`.toLowerCase();
  return message.includes("payload") || message.includes("too large") || message.includes("json");
}

function renderProgressPhotos() {
  const card = elements.progressPhotos.closest(".progress-photos-card");
  if (!hasPlanAccess(FEATURE_PLANS.progressPhotos)) {
    setFeatureLocked(card, true);
    elements.progressPhotoInput.disabled = true;
    elements.progressPhotos.innerHTML = lockedFeatureHtml(
      FEATURE_PLANS.progressPhotos,
      "Fotografiile de progres si urmarirea vizuala sunt disponibile in Pro.",
    );
    return;
  }
  setFeatureLocked(card, false);
  elements.progressPhotoInput.disabled = false;
  const photos = Array.isArray(state.progressPhotos) ? state.progressPhotos : [];
  if (!photos.length) {
    elements.progressPhotos.innerHTML = `<p class="compact-note">Nu ai fotografii de progres inca.</p>`;
    return;
  }
  elements.progressPhotos.innerHTML = photos.slice(0, 8).map((photo) => `
    <article class="photo-tile" data-photo-id="${escapeHtml(photo.id)}" role="button" tabindex="0" aria-label="Sterge fotografia ${escapeHtml(photo.angle)}">
      <img src="${photo.image}" alt="Fotografie progres ${escapeHtml(photo.angle)}" />
      <strong>${escapeHtml(photo.angle)}</strong>
      <small>${formatDateLong(photo.date)}</small>
    </article>
  `).join("");
}

function deleteProgressPhoto(event) {
  if (!hasPlanAccess(FEATURE_PLANS.progressPhotos)) {
    showUpgradePrompt(FEATURE_PLANS.progressPhotos);
    return;
  }
  const tile = event.target.closest("[data-photo-id]");
  if (!tile) return;
  const photoId = tile.dataset.photoId;
  if (!window.confirm("Stergi fotografia de progres selectata?")) return;
  state.progressPhotos = (state.progressPhotos || []).filter((photo) => photo.id !== photoId);
  saveState();
  renderProgressPhotos();
  showToast("Fotografie stearsa", "Poza de progres a fost eliminata.");
}

function showChartTooltip(event) {
  if (!chartPoints.length || !elements.chartTooltip) return;
  const rect = elements.progressChart.getBoundingClientRect();
  const scaleX = elements.progressChart.width / rect.width;
  const scaleY = elements.progressChart.height / rect.height;
  const localX = (event.clientX - rect.left) * scaleX;
  const localY = (event.clientY - rect.top) * scaleY;
  const point = nearestChartPoint(localX, localY);
  if (!point) {
    hideChartTooltip();
    return;
  }
  elements.chartTooltip.innerHTML = `<strong>${escapeHtml(point.label)}</strong><br><span>${escapeHtml(point.valueText)}</span>`;
  const tooltipWidth = 190;
  const left = Math.min(rect.width - tooltipWidth - 8, Math.max(8, event.clientX - rect.left + 12));
  const top = Math.max(8, event.clientY - rect.top - 48);
  elements.chartTooltip.style.left = `${left}px`;
  elements.chartTooltip.style.top = `${top}px`;
  elements.chartTooltip.classList.remove("hidden");
}

function showChartTouchTooltip(event) {
  const touch = event.touches?.[0] || event.changedTouches?.[0];
  if (touch) showChartTooltip(touch);
}

function nearestChartPoint(x, y) {
  let nearest = null;
  let nearestDistance = Infinity;
  chartPoints.forEach((point) => {
    const distance = Math.hypot(point.x - x, point.y - y);
    const horizontalDistance = Math.abs(point.x - x);
    if ((distance < nearestDistance && horizontalDistance <= 44) || (!nearest && horizontalDistance <= 28)) {
      nearest = point;
      nearestDistance = distance;
    }
  });
  return nearestDistance <= 72 ? nearest : null;
}

function hideChartTooltip() {
  elements.chartTooltip?.classList.add("hidden");
}

function progressConsistency(range, completed) {
  if (!range.months) {
    return Math.min(100, Math.round((completed / 16) * 100));
  }
  const monthTargets = activeMonthsForProgress(range)
    .map(({ start, end }) => {
      const monthCompleted = workoutEntriesInRange(start, end).filter(([, workout]) => isWorkoutCompleted(workout)).length;
      return Math.min(1, monthCompleted / 16);
    });
  if (!monthTargets.length) return 0;
  const average = monthTargets.reduce((sum, value) => sum + value, 0) / monthTargets.length;
  return Math.round(average * 100);
}

function activeMonthsForProgress(range) {
  if (!range.months) return [];
  const now = new Date();
  const currentYear = now.getFullYear();
  if (range.year < currentYear) return range.months;
  if (range.year > currentYear) return [];
  return range.months.slice(0, now.getMonth() + 1);
}

function hydrateAccount() {
  if (!state.user) return;
  state.user.profile = state.user.profile || defaultProfile();
  elements.profileName.textContent = state.user.name || "Contul tau";
  elements.profileEmail.textContent = state.user.email || "";
  elements.profileInitials.setAttribute("aria-label", initials(state.user.name || "FitPulse"));
  elements.profileInitials.textContent = initials(state.user.name || "FitPulse");
  elements.profileInitials.style.backgroundImage = state.user.profile.avatar ? `url("${state.user.profile.avatar}")` : "";
  elements.profileInitials.classList.toggle("has-photo", Boolean(state.user.profile.avatar));
  const profileParts = [
    state.user.profile.weight ? `${state.user.profile.weight} kg` : "",
    state.user.profile.height ? `${state.user.profile.height} cm` : "",
    state.user.profile.goal || "",
  ].filter(Boolean);
  elements.profileMeta.textContent = profileParts.length ? profileParts.join(" · ") : "Editeaza profilul";
  elements.weightInput.value = state.user.profile.weight || "";
  elements.heightInput.value = state.user.profile.height || "";
  elements.goalInput.value = state.user.profile.goal || "";
  elements.gymNameInput.value = state.gym?.name || "";
  elements.gymLocationInput.value = state.gym?.location || "";
  elements.gymScheduleInput.value = state.gym?.schedule || "";
  elements.gymNotesInput.value = state.gym?.notes || "";
  elements.subStartInput.value = state.subscription?.start || "";
  elements.subEndInput.value = state.subscription?.end || "";
  elements.subTypeInput.value = state.subscription?.type || "";
  elements.subPriceInput.value = state.subscription?.price || "";
  elements.subNotesInput.value = state.subscription?.notes || "";
}

function renderAccount() {
  hydrateAccount();
  renderPlans();
  renderSubscription();
  renderGymSummary();
  renderSettings();
}

function toggleProfileEditor() {
  openModal(elements.profileEditor);
}

function toggleSettingsModal() {
  renderSettingsForm();
  openModal(elements.settingsModal);
}

function prepareModalLayer() {
  document.body.append(
    elements.modalOverlay,
    elements.profileEditor,
    elements.planOptions,
    elements.hydrationModal,
    elements.challengeModal,
    elements.achievementsModal,
    elements.muscleModal,
    elements.subscriptionEditor,
    elements.gymEditor,
    elements.settingsModal,
    elements.legalModal,
    elements.deleteWorkoutModal,
  );
}

function openModal(target) {
  allModals().forEach((modal) => {
    if (modal !== target) modal.classList.add("hidden");
  });
  target.classList.remove("hidden");
  elements.modalOverlay.classList.remove("hidden");
  document.body.classList.add("modal-active");
}

function closeModals() {
  applyTheme();
  pendingWorkoutDeleteDate = "";
  lastCalendarTap = { key: "", time: 0 };
  allModals().forEach((modal) => modal.classList.add("hidden"));
  elements.modalOverlay.classList.add("hidden");
  document.body.classList.remove("modal-active");
}

function allModals() {
  return [
    elements.profileEditor,
    elements.planOptions,
    elements.hydrationModal,
    elements.challengeModal,
    elements.achievementsModal,
    elements.muscleModal,
    elements.subscriptionEditor,
    elements.gymEditor,
    elements.settingsModal,
    elements.legalModal,
    elements.deleteWorkoutModal,
  ].filter(Boolean);
}

function openLegalModal(type) {
  const docs = legalDocuments();
  const doc = docs[type] || docs.privacy;
  elements.legalModalTitle.textContent = doc.title;
  elements.legalModalBody.innerHTML = doc.body;
  openModal(elements.legalModal);
}

function legalDocuments() {
  const updated = "28 iulie 2026";
  return {
    privacy: {
      title: "Privacy Policy",
      body: `
        <p><strong>Ultima actualizare:</strong> ${updated}</p>
        <p>FitPulse este o aplicatie pentru planificare antrenamente, progres, hidratare, abonament sala si profil fitness.</p>
        <h4>Date colectate</h4>
        <p>Aplicatia poate salva nume, email, poza profil, greutate, inaltime, obiectiv, antrenamente, exercitii, seturi, volum, hidratare, abonament sala, sala folosita si fotografii de progres incarcate de utilizator.</p>
        <h4>De ce folosim datele</h4>
        <p>Datele sunt folosite pentru autentificare, sincronizare intre dispozitive, afisarea progresului, calcularea statisticilor si pastrarea istoricului contului.</p>
        <h4>Stocare</h4>
        <p>Datele contului sunt sincronizate prin Supabase. O parte din date pot ramane local pe dispozitiv pentru functionare rapida si offline.</p>
        <h4>Partajare</h4>
        <p>Nu vindem datele utilizatorilor. Datele pot fi procesate de servicii tehnice folosite pentru autentificare, baza de date, gazduire si plata prin Stripe.</p>
        <h4>Drepturi</h4>
        <p>Poti solicita stergerea contului sau a datelor prin email la <a href="mailto:hcalinoiu@gmail.com">hcalinoiu@gmail.com</a>.</p>
      `,
    },
    terms: {
      title: "Terms & Conditions",
      body: `
        <p><strong>Ultima actualizare:</strong> ${updated}</p>
        <p>Prin folosirea FitPulse esti de acord cu aceste conditii.</p>
        <h4>Scopul aplicatiei</h4>
        <p>FitPulse ofera organizare pentru sala, progres si obiceiuri fitness. Aplicatia nu inlocuieste sfatul unui medic, nutritionist sau antrenor autorizat.</p>
        <h4>Cont si date</h4>
        <p>Utilizatorul este responsabil pentru corectitudinea datelor introduse si pentru pastrarea accesului la cont.</p>
        <h4>Planuri platite</h4>
        <p>Planurile Plus si Pro pot fi platite prin Stripe. Accesul platit va fi acordat dupa confirmarea platii si verificarea contului asociat.</p>
        <h4>Limitari</h4>
        <p>Statisticile, recomandarile si estimarile pot fi aproximative. Foloseste aplicatia ca instrument de organizare, nu ca diagnostic sau prescriptie.</p>
        <h4>Suport</h4>
        <p>Pentru intrebari sau probleme, contacteaza suportul la <a href="mailto:hcalinoiu@gmail.com">hcalinoiu@gmail.com</a>.</p>
      `,
    },
    support: {
      title: "Contact suport",
      body: `
        <p>Pentru suport FitPulse, trimite un mesaj cu emailul contului, dispozitivul folosit si problema intalnita.</p>
        <div class="legal-contact-actions">
          <a class="support-button help-button" href="mailto:hcalinoiu@gmail.com?subject=Ticket%20FitPulse%20-%20Suport&body=Salut%2C%20am%20nevoie%20de%20ajutor%20cu%20FitPulse.%0A%0AEmail%20cont%3A%20%0ADispozitiv%3A%20%0AProblema%3A%20" target="_blank" rel="noopener noreferrer">Trimite email</a>
          <a class="support-button contact-button" href="https://ig.me/m/vaultix.tech" target="_blank" rel="noopener noreferrer">Instagram Vaultix.tech</a>
        </div>
      `,
    },
  };
}

function renderSettings() {
  const settings = normalizedSettings();
  const themeLabel = settings.theme === "light" ? "tema luminoasa" : "tema intunecata";
  const notificationLabel = settings.notifications ? "notificari active" : "notificari oprite";
  elements.settingsSummary.textContent = `${capitalize(themeLabel)}, ${notificationLabel}.`;
}

function renderSettingsForm() {
  const settings = normalizedSettings();
  elements.themeModeInputs.forEach((input) => {
    input.checked = input.value === settings.theme;
  });
  elements.notificationsSetting.checked = Boolean(settings.notifications);
  elements.vibrationSetting.checked = Boolean(settings.vibration);
  elements.soundSetting.checked = Boolean(settings.sound);
}

function previewThemeSetting(event) {
  document.body.dataset.theme = event.target.value === "light" ? "light" : "dark";
}

function saveSettings(event) {
  event.preventDefault();
  const selectedTheme = Array.from(elements.themeModeInputs).find((input) => input.checked)?.value || "dark";
  state.settings = {
    ...normalizedSettings(),
    theme: selectedTheme === "light" ? "light" : "dark",
    notifications: elements.notificationsSetting.checked,
    vibration: elements.vibrationSetting.checked,
    sound: elements.soundSetting.checked,
    updatedAt: new Date().toISOString(),
  };
  applyTheme();
  saveState();
  renderSettings();
  renderProgress();
  closeModals();
  showToast("Setari salvate", "Preferintele aplicatiei au fost actualizate.");
}

function normalizedSettings() {
  return {
    ...defaultSettings(),
    ...(state.settings && typeof state.settings === "object" ? state.settings : {}),
  };
}

function defaultSettings() {
  return {
    theme: "dark",
    notifications: true,
    vibration: true,
    sound: false,
    updatedAt: "",
  };
}

function applyTheme() {
  const settings = normalizedSettings();
  document.body.dataset.theme = settings.theme === "light" ? "light" : "dark";
}

function saveProfile(event) {
  event.preventDefault();
  state.user.profile = {
    ...defaultProfile(),
    ...(state.user.profile || {}),
    weight: elements.weightInput.value.trim(),
    height: elements.heightInput.value.trim(),
    goal: elements.goalInput.value,
  };
  saveState();
  hydrateAccount();
  closeModals();
  showToast("Profil salvat", "Datele profilului tau au fost actualizate.");
}

function handleAvatarImage(event) {
  const file = event.target.files?.[0];
  if (!file || !state.user) return;
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const size = 360;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      const sourceSize = Math.min(image.width, image.height);
      const sx = (image.width - sourceSize) / 2;
      const sy = (image.height - sourceSize) / 2;
      context.drawImage(image, sx, sy, sourceSize, sourceSize, 0, 0, size, size);
      state.user.profile = {
        ...defaultProfile(),
        ...(state.user.profile || {}),
        avatar: canvas.toDataURL("image/jpeg", 0.78),
      };
      saveState();
      hydrateAccount();
      showToast("Poza salvata", "Poza profilului a fost actualizata.");
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function openSubscriptionEditor() {
  hydrateAccount();
  clearSubscriptionErrors();
  elements.subscriptionEditorTitle.textContent = state.subscription?.start ? "Editeaza abonament sala" : "Adauga abonament sala";
  elements.deleteSubscriptionButton.classList.toggle("hidden", !state.subscription?.start && !state.subscription?.end);
  openModal(elements.subscriptionEditor);
}

function clearSubscriptionErrors() {
  elements.subStartError.textContent = "";
  elements.subEndError.textContent = "";
  elements.subPriceError.textContent = "";
}

function saveSubscription(event) {
  event.preventDefault();
  clearSubscriptionErrors();
  const start = elements.subStartInput.value;
  const end = elements.subEndInput.value;
  const price = elements.subPriceInput.value.trim();
  let valid = true;
  if (!start) {
    elements.subStartError.textContent = "Data de inceput este obligatorie.";
    valid = false;
  }
  if (!end) {
    elements.subEndError.textContent = "Data de expirare este obligatorie.";
    valid = false;
  }
  if (start && end && end < start) {
    elements.subEndError.textContent = "Data de expirare nu poate fi inaintea datei de inceput.";
    valid = false;
  }
  if (price && (!Number.isFinite(Number(price)) || Number(price) < 0)) {
    elements.subPriceError.textContent = "Pretul trebuie sa fie numeric si pozitiv.";
    valid = false;
  }
  if (!valid) return;
  state.subscription = {
    id: state.subscription?.id || makeId("membership"),
    start,
    end,
    type: elements.subTypeInput.value.trim(),
    price,
    notes: elements.subNotesInput.value.trim(),
    createdAt: state.subscription?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  saveState();
  renderSubscription();
  closeModals();
  showToast("Abonament salvat", "Rezumatul abonamentului a fost actualizat.");
}

function deleteSubscription() {
  if (!window.confirm("Sigur vrei sa stergi abonamentul salii?")) return;
  state.subscription = defaultSubscription();
  saveState();
  renderSubscription();
  closeModals();
  showToast("Abonament sters", "Cardul a revenit la starea fara date.");
}

function renderSubscription() {
  const { start, end, type } = state.subscription || defaultSubscription();
  const hasFullRange = Boolean(start && end);
  elements.subscriptionReportButton.disabled = !hasFullRange;
  elements.editSubscriptionButton.textContent = hasFullRange ? "Editeaza" : "Adauga abonament";
  if (hasPlanAccess(FEATURE_PLANS.subscriptionReport)) {
    delete elements.subscriptionReportButton.dataset.upgradePlan;
  } else {
    elements.subscriptionReportButton.dataset.upgradePlan = FEATURE_PLANS.subscriptionReport;
  }
  elements.subscriptionReportButton.textContent = hasPlanAccess(FEATURE_PLANS.subscriptionReport)
    ? "Descarca istoric abonament PDF"
    : "PDF blocat - upgrade";
  elements.subscriptionReportMeta.textContent = hasFullRange
    ? hasPlanAccess(FEATURE_PLANS.subscriptionReport)
      ? `Raport disponibil pentru ${formatDateLong(start)} - ${formatDateLong(end)}.`
      : upgradeText(FEATURE_PLANS.subscriptionReport)
    : "Adauga data de inceput si data de expirare ca sa poti descarca raportul PDF.";
  if (!hasFullRange) {
    elements.subscriptionStatus.innerHTML = `<span>Nu ai adaugat un abonament.</span>`;
    return;
  }
  const status = membershipStatus(start, end);
  elements.subscriptionStatus.innerHTML = `
    <strong>De la ${formatDateLong(start)} pana la ${formatDateLong(end)}</strong>
    ${type ? `<span>${escapeHtml(type)}</span>` : ""}
    <span>${escapeHtml(status)}</span>
  `;
}

function downloadSubscriptionReport() {
  if (!hasPlanAccess("plus")) {
    showToast("Disponibil in Plus", "Raportul PDF complet intra in planurile Plus si Pro.");
    return;
  }
  const range = subscriptionReportRange();
  if (!range) {
    showToast("Raport indisponibil", "Completeaza data de inceput si data de expirare a abonamentului.");
    return;
  }
  const workouts = workoutEntriesInRange(range.start, range.end);
  const completed = workouts.filter(([, workout]) => isWorkoutCompleted(workout)).length;
  const planned = workouts.filter(([, workout]) => workout.planned).length;
  const reportTarget = subscriptionWorkoutTarget(range);
  const consistency = Math.min(100, Math.round((completed / reportTarget) * 100));
  const volume = calculateTotalVolume(range);
  const records = personalRecords(range).length;
  const hydrationDays = Object.values(state.hydration || {}).filter((entry) => dateInRange(entry.date, range.start, range.end));
  const hydrationAverage = hydrationDays.length ? Math.round(hydrationDays.reduce((sum, entry) => sum + Number(entry.consumedMl || 0), 0) / hydrationDays.length) : 0;
  const lines = [
    "FitPulse - Istoric abonament",
    `Perioada: ${formatDateLong(range.start)} - ${formatDateLong(range.end)}`,
    `Cont: ${state.user?.name || "Utilizator"} (${state.user?.email || "email lipsa"})`,
    "",
    "Rezumat",
    `Antrenamente planificate: ${planned}`,
    `Antrenamente bifate: ${completed}`,
    `Tinta perioada: ${reportTarget} zile lucrate`,
    `Consistenta in abonament: ${consistency}%`,
    `Volum ridicat: ${formatKg(volume)}`,
    `Recorduri personale: ${records}`,
    `Medie hidratare zilnica: ${formatMl(hydrationAverage)}`,
    "",
    "Plusuri",
    consistency >= 70 ? "Ai pastrat un ritm bun de antrenament." : "Ai deja zile salvate si poti construi constanta mai usor.",
    records ? "Ai atins recorduri personale in perioada abonamentului." : "Ai pastrat datele pregatite pentru recorduri viitoare.",
    "",
    "Minusuri",
    consistency < 70 ? "Consistenta este sub 70%, deci planul are nevoie de zile fixe si repetabile." : "Atentie la pauze lungi intre antrenamente.",
    hydrationAverage && hydrationAverage < 2000 ? "Hidratarea medie este sub 2.000 ml; merita crescuta gradual." : "Nu exista minus clar la hidratare din datele salvate.",
    "",
    "Sfaturi",
    "Pastreaza 3-5 zile fixe pe saptamana si bifeaza exercitiile imediat dupa antrenament.",
    "Noteaza kg si repetarile in antrenamentul activ ca volumul si recordurile sa fie calculate corect.",
    "Compara raportul urmatorului abonament cu acesta pentru a vedea evolutia reala.",
    "",
    "Antrenamente",
    ...reportWorkoutLines(workouts),
  ];
  downloadPdf(`fitpulse-raport-${range.start}-${range.end}.pdf`, "FitPulse", lines);
  showToast("Raport descarcat", "Istoricul abonamentului a fost generat ca PDF.");
}

function saveEquipment(event) {
  event.preventDefault();
  elements.gymNameError.textContent = "";
  state.gym = state.gym || defaultGym();
  state.gym.equipment = Array.isArray(state.gym.equipment) ? state.gym.equipment : [];
  state.gym.name = elements.gymNameInput.value.trim();
  state.gym.location = elements.gymLocationInput.value.trim();
  state.gym.schedule = elements.gymScheduleInput.value.trim();
  state.gym.notes = elements.gymNotesInput.value.trim();
  if (!state.gym.name) {
    elements.gymNameError.textContent = "Numele salii este obligatoriu.";
    return;
  }
  state.gym.updatedAt = new Date().toISOString();
  elements.equipmentInput.value = "";
  saveState();
  renderGymSummary();
  closeModals();
  showToast("Sala salvata", "Rezumatul salii a fost actualizat.");
}

function openGymEditor() {
  hydrateAccount();
  elements.gymEditorTitle.textContent = state.gym?.name ? "Editeaza informatii despre sala" : "Adauga informatii despre sala";
  elements.deleteGymButton.classList.toggle("hidden", !state.gym?.name);
  renderEquipment();
  openModal(elements.gymEditor);
}

function addEquipmentDraft() {
  const equipment = elements.equipmentInput.value.trim().toLowerCase();
  if (!equipment) return;
  state.gym = state.gym || defaultGym();
  state.gym.equipment = Array.isArray(state.gym.equipment) ? state.gym.equipment : [];
  if (state.gym.equipment.includes(equipment)) {
    showToast("Aparat duplicat", "Aparatul exista deja in lista.");
    return;
  }
  state.gym.equipment.push(equipment);
  elements.equipmentInput.value = "";
  renderEquipment();
}

function deleteGym() {
  if (!window.confirm("Sigur vrei sa stergi informatiile despre sala?")) return;
  state.gym = defaultGym();
  saveState();
  renderGymSummary();
  closeModals();
  showToast("Sala stearsa", "Informatiile despre sala au fost eliminate.");
}

function renderEquipment() {
  const equipment = Array.isArray(state.gym?.equipment) ? state.gym.equipment : [];
  elements.equipmentList.innerHTML = equipment
    .map((item) => `<button class="equipment-chip" data-equipment="${escapeHtml(item)}" type="button">${escapeHtml(item)} ×</button>`)
    .join("");
}

function removeEquipmentDraft(event) {
  const button = event.target.closest("[data-equipment]");
  if (!button) return;
  state.gym.equipment = (state.gym.equipment || []).filter((item) => item !== button.dataset.equipment);
  renderEquipment();
}

function renderGymSummary() {
  const equipment = Array.isArray(state.gym?.equipment) ? state.gym.equipment : [];
  elements.editGymButton.textContent = state.gym?.name ? "Editeaza" : "Adauga sala";
  elements.gymSummary.innerHTML = state.gym?.name
    ? `<strong>${escapeHtml(state.gym.name)}</strong>${state.gym.location ? `<span>${escapeHtml(state.gym.location)}</span>` : ""}<span>${equipment.length} aparate salvate</span>`
    : "Nu ai adaugat informatii despre sala.";
}

function generatePlanFromGym() {
  const plan = buildGeneratedWorkoutPlan(generateExercisesFromGym().slice(0, 7));
  const workout = state.workouts[selectedDate] || {};
  state.workouts[selectedDate] = {
    ...workout,
    planned: true,
    focus: "Plan generat din sala",
    exercises: plan.exercises,
    exercisePrescriptions: plan.exercisePrescriptions,
    exerciseChecks: syncExerciseChecks(plan.exercises, workout.exerciseChecks),
  };
  saveState();
  switchView("trainingView");
  renderAll();
  showToast("Plan generat", "Exercitiile au fost create din aparatele salii.");
}

function generateExercisesForFocus(focus) {
  if (focus === "Plan generat din sala") {
    return generateExercisesFromGym().slice(0, 8);
  }
  const equipment = Array.isArray(state.gym?.equipment) ? state.gym.equipment : [];
  const suggestions = equipment.flatMap((item) => {
    const normalized = item.toLowerCase();
    const rule = gymExerciseRules.find(({ keywords }) => keywords.some((keyword) => normalized.includes(keyword)));
    if (!rule) return [];
    return rule.exercises[focus] || [];
  });
  const unique = [...new Set(suggestions)];
  return unique.length ? unique.slice(0, 8) : defaultExercises(focus);
}

function generateExercisesFromGym() {
  const equipment = Array.isArray(state.gym?.equipment) ? state.gym.equipment : [];
  const suggestions = equipment.flatMap((item) => {
    const foundKey = Object.keys(exerciseMap).find((key) => item.includes(key));
    return foundKey ? exerciseMap[foundKey] : [capitalize(item)];
  });
  const unique = [...new Set(suggestions)];
  return unique.length ? unique : defaultExercises("Full body");
}

function buildGeneratedWorkoutPlan(rawExercises) {
  const exercisePrescriptions = {};
  const names = [];
  (rawExercises || []).forEach((exercise) => {
    const parsed = parseExercisePrescription(exercise);
    if (!parsed.name || names.includes(parsed.name)) return;
    names.push(parsed.name);
    if (parsed.sets || parsed.reps) {
      exercisePrescriptions[parsed.name] = {
        sets: parsed.sets || 1,
        reps: parsed.reps || "",
      };
    }
  });
  if (!names.length) return buildGeneratedWorkoutPlan(defaultExercises("Full body"));
  return {
    exercises: names.join("\n"),
    exercisePrescriptions,
  };
}

function cleanGeneratedExercises(exercises) {
  return [...new Set((exercises || [])
    .map((exercise) => stripExercisePrescription(exercise))
    .filter(Boolean))];
}

function parseExercisePrescription(exercise) {
  const text = String(exercise || "").trim();
  const match = text.match(/\b(\d+)\s*x\s*(\d+)\s*(?:s|sec|secunde)?\b/i);
  return {
    name: stripExercisePrescription(text),
    sets: match ? Number(match[1]) : 0,
    reps: match ? String(Number(match[2])) : "",
  };
}

function stripExercisePrescription(exercise) {
  return String(exercise || "")
    .replace(/\s+\d+\s*x\s*\d+\s*(?:s|sec|secunde)?\b/gi, "")
    .replace(/\s+\d+\s*seturi?\b.*$/gi, "")
    .replace(/\s+\d+\s*repetari\b.*$/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function logout() {
  await supabaseClient.auth.signOut();
  currentSession = null;
  state = defaultState();
  clearLocalState();
  showAuth();
  showToast("Logout", "Ai iesit din cont.");
}

function resetProgress() {
  const confirmed = window.confirm("Sigur vrei sa stergi progresul? Vor fi sterse antrenamentele, hidratarea, provocarile, recordurile si statisticile.");
  if (!confirmed) return;
  state.workouts = {};
  state.hydration = {};
  state.progress = { currentStreak: 0, bestStreak: 0 };
  state.challenge = null;
  state.achievements = [];
  state.sessions = [];
  state.activeWorkout = null;
  state.personalRecords = [];
  state.progressPhotos = [];
  selectedDate = toKey(new Date());
  homeSelectedDate = selectedDate;
  homeWeekStart = startOfWeek(parseLocalDate(selectedDate));
  visibleMonth = new Date();
  saveState();
  renderAll();
  showToast("Progres resetat", "Antrenamentele si statisticile au fost sterse.");
}

function installApp() {
  if (!deferredInstallPrompt) {
    showToast("Instalare", "Pe iPhone foloseste Share > Add to Home Screen.");
    return;
  }
  deferredInstallPrompt.prompt();
  deferredInstallPrompt = null;
  elements.installButton.classList.add("hidden");
  showToast("Instalare pornita", "Urmeaza pasii afisati de browser.");
}

function changeMonth(delta) {
  visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + delta, 1);
  renderTrainingCalendar();
}

function handleTapFeedback(event) {
  const button = event.target.closest("button");
  if (!button) return;
  button.classList.remove("tap-feedback");
  void button.offsetWidth;
  window.requestAnimationFrame(() => {
    button.classList.add("tap-feedback");
    window.setTimeout(() => button.classList.remove("tap-feedback"), 360);
  });
}

function handleUpgradeClick(event) {
  const button = event.target.closest("[data-upgrade-plan]");
  if (!button) return;
  if (button.classList.contains("range-mode") || button === elements.startWorkoutButton || button === elements.challengeButton) return;
  event.preventDefault();
  showUpgradePrompt(button.dataset.upgradePlan || "plus");
}

function showToast(title, message = "") {
  if (!elements.toastHost) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<strong>${escapeHtml(title)}</strong>${message ? `<span>${escapeHtml(message)}</span>` : ""}`;
  elements.toastHost.prepend(toast);
  void toast.offsetWidth;
  while (elements.toastHost.children.length > 3) {
    elements.toastHost.lastElementChild.remove();
  }
  window.setTimeout(() => toast.classList.add("leaving"), 5200);
  window.setTimeout(() => toast.remove(), 5450);
}

function showAuthStatus(message, type = "info") {
  if (!elements.authStatus) return;
  elements.authStatus.textContent = message;
  elements.authStatus.className = `auth-status ${message ? "" : "hidden"} ${type}`;
}

function loadState() {
  const fallback = defaultState();
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"));
  } catch {
    return fallback;
  }
}

function defaultState() {
  return {
    user: null,
    plan: "free",
    workouts: {},
    hydration: {},
    progress: { currentStreak: 0, bestStreak: 0 },
    challenge: null,
    achievements: [],
    sessions: [],
    activeWorkout: null,
    personalRecords: [],
    exerciseNotes: {},
    progressPhotos: [],
    subscription: defaultSubscription(),
    gym: defaultGym(),
    settings: defaultSettings(),
  };
}

function defaultSubscription() {
  return { id: "", start: "", end: "", type: "", price: "", notes: "", createdAt: "", updatedAt: "" };
}

function defaultGym() {
  return { id: "", name: "", location: "", schedule: "", equipment: [], notes: "", createdAt: "", updatedAt: "" };
}

function defaultProfile() {
  return {
    avatar: "",
    weight: "",
    height: "",
    goal: "",
    waterTargetMl: 2500,
  };
}

function normalizeState(saved) {
  const fallback = defaultState();
  const source = saved && typeof saved === "object" ? saved : {};
  return {
    user: source.user && typeof source.user === "object" ? {
      id: source.user.id || "",
      name: source.user.name || "",
      email: source.user.email || "",
      authProvider: source.user.authProvider || "",
      profile: {
        ...defaultProfile(),
        ...(source.user.profile && typeof source.user.profile === "object" ? source.user.profile : {}),
      },
    } : null,
    plan: PLAN_LIMITS[source.plan] ? source.plan : "free",
    workouts: source.workouts && typeof source.workouts === "object" && !Array.isArray(source.workouts) ? source.workouts : {},
    subscription: {
      ...defaultSubscription(),
      ...(source.subscription && typeof source.subscription === "object" ? source.subscription : {}),
      type: source.subscription?.type || "",
      price: source.subscription?.price || "",
      notes: source.subscription?.notes || "",
    },
    gym: {
      name: source.gym && typeof source.gym === "object" ? source.gym.name || "" : "",
      location: source.gym?.location || "",
      schedule: source.gym?.schedule || "",
      equipment: Array.isArray(source.gym?.equipment) ? source.gym.equipment : [],
      notes: source.gym?.notes || "",
    },
    hydration: source.hydration && typeof source.hydration === "object" && !Array.isArray(source.hydration) ? source.hydration : {},
    progress: {
      currentStreak: Number(source.progress?.currentStreak || 0),
      bestStreak: Number(source.progress?.bestStreak || 0),
    },
    challenge: normalizeChallenge(source.challenge),
    achievements: Array.isArray(source.achievements) ? source.achievements : [],
    sessions: Array.isArray(source.sessions) ? source.sessions : [],
    activeWorkout: source.activeWorkout && typeof source.activeWorkout === "object" ? source.activeWorkout : null,
    personalRecords: Array.isArray(source.personalRecords) ? source.personalRecords : [],
    exerciseNotes: source.exerciseNotes && typeof source.exerciseNotes === "object" && !Array.isArray(source.exerciseNotes) ? source.exerciseNotes : {},
    progressPhotos: Array.isArray(source.progressPhotos) ? source.progressPhotos : [],
    settings: {
      ...defaultSettings(),
      ...(source.settings && typeof source.settings === "object" ? source.settings : {}),
      theme: source.settings?.theme === "light" ? "light" : "dark",
    },
  };
}

function saveState() {
  persistStateLocal();
  scheduleRemoteSync();
}

function flushStateBeforeExit() {
  persistStateLocal();
  if (currentSession && !isLoadingRemote) {
    window.clearTimeout(syncTimer);
    syncRemoteState().catch(handleSyncError);
  }
}

function persistStateLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (state.user?.email) {
    const accounts = loadAccounts();
    accounts[state.user.email.toLowerCase()] = state;
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  }
}

function clearLocalState() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ACCOUNTS_KEY);
}

function scheduleRemoteSync() {
  if (!currentSession || isLoadingRemote) return;
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(() => {
    syncRemoteState().catch(handleSyncError);
  }, 450);
}

async function syncRemoteState(options = {}) {
  if (!currentSession && !options.force) return;
  const userId = currentSession?.user?.id || state.user?.id;
  if (!userId || !state.user) return;
  await Promise.allSettled([
    syncProfile(userId, state.user),
    syncWorkouts(userId),
    syncSubscription(userId),
    syncGym(userId),
  ]).then((results) => logSyncFailures(results));
  await syncDurableProgress(userId);
  await syncAppState(userId);
}

function logSyncFailures(results) {
  results.forEach((result) => {
    if (result.status === "rejected") {
      console.warn("Partial Supabase sync failed", result.reason);
    }
  });
}

async function syncProfile(userId, user) {
  const profile = user.profile || defaultProfile();
  const { error } = await supabaseClient.from("profiles").upsert({
    id: userId,
    name: user.name || "",
    email: user.email || "",
    avatar_url: profile.avatar || null,
    weight_kg: profile.weight || null,
    height_cm: profile.height || null,
    goal: profile.goal || null,
    water_target_ml: Number(profile.waterTargetMl || state.settings?.waterTargetMl || 2500),
    updated_at: new Date().toISOString(),
  });
  if (error) {
    const { error: fallbackError } = await supabaseClient.from("profiles").upsert({
      id: userId,
      name: user.name || "",
      email: user.email || "",
      avatar_url: profile.avatar || null,
      weight_kg: profile.weight || null,
      height_cm: profile.height || null,
      goal: profile.goal || null,
      updated_at: new Date().toISOString(),
    });
    if (fallbackError) throw fallbackError;
  }
  const { error: planError } = await supabaseClient.from("profiles").update({
    plan: PLAN_LIMITS[state.plan] ? state.plan : "free",
    updated_at: new Date().toISOString(),
  }).eq("id", userId);
  if (planError) {
    console.warn("Plan sync skipped", planError);
  }
}

async function syncWorkouts(userId) {
  const rows = Object.entries(state.workouts).map(([date, workout]) => ({
    user_id: userId,
    workout_date: date,
    focus: workout.focus || "Antrenament",
    exercises: workout.exercises || "",
    exercise_checks: workout.exerciseChecks || {},
    planned: Boolean(workout.planned),
    completed: Boolean(workout.completed),
    updated_at: new Date().toISOString(),
  }));
  await deleteUserRows("workouts", userId);
  if (!rows.length) return;
  const { error } = await supabaseClient.from("workouts").insert(rows);
  if (error) throw error;
}

async function syncSubscription(userId) {
  const row = {
    user_id: userId,
    start_date: state.subscription?.start || null,
    end_date: state.subscription?.end || null,
    reminder_days: Number(state.subscription?.reminderDays || 5),
    membership_type: state.subscription?.type || null,
    price: state.subscription?.price || null,
    notes: state.subscription?.notes || null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabaseClient.from("subscriptions").upsert(row);
  if (!error) return;
  const { membership_type, price, notes, ...legacyRow } = row;
  void membership_type;
  void price;
  void notes;
  const { error: fallbackError } = await supabaseClient.from("subscriptions").upsert(legacyRow);
  if (fallbackError) throw fallbackError;
}

async function syncGym(userId) {
  const row = {
    user_id: userId,
    name: state.gym?.name || "",
    location: state.gym?.location || null,
    schedule: state.gym?.schedule || null,
    equipment: Array.isArray(state.gym?.equipment) ? state.gym.equipment : [],
    notes: state.gym?.notes || null,
    updated_at: new Date().toISOString(),
  };
  const { error } = await supabaseClient.from("gyms").upsert(row);
  if (!error) return;
  const { location, schedule, notes, ...legacyRow } = row;
  void location;
  void schedule;
  void notes;
  const { error: fallbackError } = await supabaseClient.from("gyms").upsert(legacyRow);
  if (fallbackError) throw fallbackError;
}

async function syncDurableProgress(userId) {
  try {
    await Promise.all([
      syncWorkoutSessions(userId),
      syncPersonalRecords(userId),
      syncProgressPhotos(userId),
    ]);
    durableProgressTablesAvailable = true;
  } catch (error) {
    durableProgressTablesAvailable = false;
    console.warn("Dedicated progress sync skipped until schema is updated", error);
  }
}

async function syncWorkoutSessions(userId) {
  await deleteUserRows("workout_sessions", userId);
  const sessions = Array.isArray(state.sessions) ? state.sessions : [];
  if (!sessions.length) return;
  const rows = sessions.map((session) => ({
    user_id: userId,
    session_id: session.id || makeId("session"),
    workout_date: session.workoutDate || null,
    focus: session.focus || null,
    total_volume: Number(session.totalVolume || activeWorkoutTotals(session).volume || 0),
    payload: session,
    updated_at: session.endedAt || session.startedAt || new Date().toISOString(),
  }));
  const { error } = await supabaseClient.from("workout_sessions").insert(rows);
  if (error) throw error;
}

async function syncPersonalRecords(userId) {
  await deleteUserRows("personal_records", userId);
  const records = Array.isArray(state.personalRecords) ? state.personalRecords : [];
  if (!records.length) return;
  const rows = records.map((record) => ({
    user_id: userId,
    record_id: record.id || makeId("record"),
    achieved_at: record.achievedAt || null,
    exercise_id: record.exerciseId || null,
    record_type: record.type || null,
    payload: record,
    updated_at: record.achievedAt || new Date().toISOString(),
  }));
  const { error } = await supabaseClient.from("personal_records").insert(rows);
  if (error) throw error;
}

async function syncProgressPhotos(userId) {
  await deleteUserRows("progress_photos", userId);
  const photos = Array.isArray(state.progressPhotos) ? state.progressPhotos : [];
  if (!photos.length) return;
  const rows = photos.map((photo) => ({
    user_id: userId,
    photo_id: photo.id || makeId("photo"),
    photo_date: photo.date || null,
    payload: progressPhotoPayload(photo),
    updated_at: photo.createdAt || new Date().toISOString(),
  }));
  const { error } = await supabaseClient.from("progress_photos").insert(rows);
  if (!error) return;
  if (!isPayloadSizeError(error)) throw error;
  const compactRows = photos.map((photo) => ({
    user_id: userId,
    photo_id: photo.id || makeId("photo"),
    photo_date: photo.date || null,
    payload: compactProgressPhotoPayload(photo),
    updated_at: photo.createdAt || new Date().toISOString(),
  }));
  const { error: compactError } = await supabaseClient.from("progress_photos").insert(compactRows);
  if (compactError) throw compactError;
}

async function syncAppState(userId) {
  const snapshot = normalizeState({
    ...state,
    activeWorkout: state.activeWorkout || null,
  });
  const { error } = await supabaseClient.from("app_states").upsert({
    user_id: userId,
    state: snapshot,
    updated_at: new Date().toISOString(),
  });
  if (error) {
    console.warn("App state sync skipped until schema is updated", error);
  }
}

async function deleteUserRows(table, userId) {
  const { error } = await supabaseClient.from(table).delete().eq("user_id", userId);
  if (error) throw error;
}

function handleSyncError(error) {
  console.error("Supabase sync failed", error);
  const now = Date.now();
  if (now - lastSyncErrorAt > 8000) {
    showToast("Sincronizare esuata", "Verifica daca schema Supabase a fost rulata corect.");
    lastSyncErrorAt = now;
  }
}

function loadAccounts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
}

function hasLocalProgress(savedState) {
  return hasRemoteProgress(savedState);
}

function hasRemoteProgress(savedState) {
  return Boolean(
    Object.keys(savedState.workouts || {}).length
    || savedState.subscription?.start
    || savedState.subscription?.end
    || savedState.gym?.name
    || (savedState.gym?.equipment || []).length
    || Object.keys(savedState.hydration || {}).length
    || (savedState.sessions || []).length
    || (savedState.personalRecords || []).length
    || (savedState.achievements || []).length
    || (savedState.progressPhotos || []).length
    || savedState.challenge?.challengeId,
  );
}

function isPasswordRecoveryUrl() {
  return window.location.hash.includes("type=recovery") || window.location.search.includes("type=recovery");
}

function isExistingSignupResponse(response) {
  const identities = response?.data?.user?.identities;
  return Array.isArray(identities) && identities.length === 0;
}

async function emailAlreadyRegistered(email) {
  try {
    const { data, error } = await supabaseClient.rpc("email_registered", { check_email: email });
    if (error) {
      console.warn("Email duplicate check unavailable", error);
      return false;
    }
    return Boolean(data);
  } catch (error) {
    console.warn("Email duplicate check failed", error);
    return false;
  }
}

function authErrorMessage(error) {
  const message = String(error?.message || "");
  const lower = message.toLowerCase();
  if (lower.includes("invalid login")) return "Emailul sau parola nu sunt corecte.";
  if (lower.includes("email not confirmed")) return "Emailul nu este confirmat. Intra pe email si apasa linkul de confirmare.";
  if (lower.includes("already registered") || lower.includes("already exists")) return "Exista deja un cont cu acest email. Incearca Login.";
  if (lower.includes("user not found")) return "Nu exista cont pentru datele introduse.";
  if (lower.includes("sms") || lower.includes("phone")) return "Resetarea prin telefon cere SMS provider activ in Supabase.";
  if (lower.includes("otp") || lower.includes("token")) return "Codul introdus nu este valid sau a expirat.";
  if (lower.includes("password")) return "Parola trebuie sa aiba minimum 6 caractere.";
  if (lower.includes("email")) return "Verifica emailul introdus.";
  return "Incearca din nou peste cateva secunde.";
}

function countCompleted(range = null) {
  return Object.entries(state.workouts)
    .filter(([date]) => !range || dateInRange(date, range.start, range.end))
    .filter(([, workout]) => isWorkoutCompleted(workout)).length;
}

function isWorkoutCompleted(workout) {
  if (!workout) return false;
  if (workout.completed) return true;
  const exerciseLines = parseExerciseLines(workout.exercises);
  return exerciseLines.length > 0 && exerciseLines.every((line) => Boolean(workout.exerciseChecks?.[line]));
}

function recentDaysRange(dayCount) {
  const endDate = new Date();
  const startDate = addDays(endDate, -(dayCount - 1));
  return {
    start: toKey(startDate),
    end: toKey(endDate),
    days: Array.from({ length: dayCount }, (_, index) => addDays(startDate, index)),
  };
}

function currentYearRange() {
  const year = new Date().getFullYear();
  return {
    year,
    start: `${year}-01-01`,
    end: `${year}-12-31`,
    months: Array.from({ length: 12 }, (_, month) => ({
      start: `${year}-${String(month + 1).padStart(2, "0")}-01`,
      end: toKey(new Date(year, month + 1, 0)),
    })),
  };
}

function subscriptionReportRange() {
  const start = state.subscription?.start || "";
  const end = state.subscription?.end || "";
  if (!start || !end || end < start) return null;
  return { start, end };
}

function subscriptionWorkoutTarget(range) {
  const totalDays = daysBetween(parseLocalDate(range.start), parseLocalDate(range.end)) + 1;
  return Math.max(1, Math.round((totalDays / 30) * 16));
}

function membershipStatus(start, end) {
  const today = toKey(new Date());
  if (start > today) return "Incepe in curand";
  if (end < today) return "Expirat";
  const remaining = daysBetween(new Date(), parseLocalDate(end));
  if (remaining <= 7) return `Expira in ${remaining} zile`;
  return "Activ";
}

function dateInRange(date, start, end) {
  return date >= start && date <= end;
}

function workoutEntriesInRange(start, end) {
  return Object.entries(state.workouts || {})
    .filter(([date]) => dateInRange(date, start, end))
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB));
}

function reportWorkoutLines(workouts) {
  if (!workouts.length) return ["Nu exista antrenamente salvate in perioada abonamentului."];
  return workouts.flatMap(([date, workout]) => {
    const status = isWorkoutCompleted(workout) ? "bifat" : "planificat";
    const exercises = parseExerciseLines(workout.exercises).map((line) => `  - ${line}`);
    return [`${formatDateLong(date)} - ${workout.focus || "Antrenament"} (${status})`, ...exercises];
  });
}

function downloadPdf(fileName, title, lines) {
  const pdf = buildSimplePdf(title, lines);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function buildSimplePdf(title, lines) {
  const cleanLines = lines.flatMap((line) => wrapPdfLine(String(line || ""), 86));
  const pageSize = 42;
  const pages = [];
  for (let index = 0; index < cleanLines.length; index += pageSize) {
    pages.push(cleanLines.slice(index, index + pageSize));
  }
  const objects = [];
  const addObject = (body) => {
    objects.push(body);
    return objects.length;
  };
  const catalogId = addObject("<< /Type /Catalog /Pages 2 0 R >>");
  const pagesId = addObject("");
  const normalFontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  const boldFontId = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");
  const pageIds = [];
  pages.forEach((pageLines) => {
    const stream = pdfTextStream(title, pageLines);
    const contentId = addObject(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    const pageId = addObject(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${normalFontId} 0 R /F2 ${boldFontId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    pageIds.push(pageId);
  });
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

function pdfTextStream(title, lines) {
  const sectionTitles = new Set(["Rezumat", "Plusuri", "Minusuri", "Sfaturi", "Antrenamente"]);
  const commands = [
    drawPdfText(title, 297, 790, 15, "F2", "center", "0 0 0"),
    drawPdfText("Track. Train. Transform.", 297, 764, 12, "F1", "center", "0 0 0"),
  ];
  let y = 710;
  let summaryColumn = 0;
  lines.forEach((line) => {
    const normalized = normalizePdfText(line);
    if (!normalized || normalized === normalizePdfText(title)) {
      y -= normalized ? 8 : 10;
      return;
    }
    if (sectionTitles.has(normalized)) {
      y -= 18;
      commands.push(drawPdfText(normalized, 297, y, 15, "F2", "center", "0 0 0"));
      y -= 22;
      summaryColumn = normalized === "Rezumat" ? 0 : -1;
      return;
    }
    if (summaryColumn >= 0 && normalized.includes(":")) {
      const [label, ...valueParts] = normalized.split(":");
      const value = valueParts.join(":").trim();
      const x = summaryColumn % 2 === 0 ? 70 : 315;
      commands.push(drawPdfText(label.trim(), x, y, 12, "F1", "left", "0 0 0"));
      commands.push(drawPdfText(value, x, y - 16, 15, "F2", "left", "0 0 0"));
      summaryColumn += 1;
      if (summaryColumn % 2 === 0) y -= 58;
      return;
    }
    const isBullet = normalized.trim().startsWith("-");
    const isDateRow = /^\d{1,2}\s/.test(normalized);
    const x = isBullet ? 82 : 58;
    commands.push(drawPdfText(normalized, x, y, 12, isDateRow ? "F2" : "F1", "left", "0 0 0"));
    y -= isBullet ? 15 : 18;
  });
  return commands.join("\n");
}

function drawPdfText(value, x, y, size, font, align = "left", color = "0 0 0") {
  const text = pdfEscape(value);
  const textWidth = estimatePdfTextWidth(value, size, font);
  const drawX = align === "center" ? x - textWidth / 2 : x;
  return `q ${color} rg BT /${font} ${size} Tf ${drawX.toFixed(1)} ${y.toFixed(1)} Td (${text}) Tj ET Q`;
}

function estimatePdfTextWidth(value, size, font) {
  const weight = font === "F2" ? 0.58 : 0.52;
  return normalizePdfText(value).length * size * weight;
}

function wrapPdfLine(line, maxLength) {
  const normalized = normalizePdfText(line);
  if (normalized.length <= maxLength) return [normalized];
  const words = normalized.split(" ");
  const wrapped = [];
  let current = "";
  words.forEach((word) => {
    if (`${current} ${word}`.trim().length > maxLength) {
      if (current) wrapped.push(current);
      current = word;
    } else {
      current = `${current} ${word}`.trim();
    }
  });
  if (current) wrapped.push(current);
  return wrapped;
}

function normalizePdfText(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "");
}

function pdfEscape(value) {
  return normalizePdfText(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function parseExerciseLines(exercises = "") {
  return exercises
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function syncExerciseChecks(exercises, previousChecks = {}) {
  return parseExerciseLines(exercises).reduce((checks, line) => {
    checks[line] = Boolean(previousChecks[line]);
    return checks;
  }, {});
}

function defaultExercises(focus) {
  const defaults = {
    "Piept si triceps": ["Impins la piept 4x8", "Impins inclinat 3x10", "Triceps pushdown 4x12"],
    "Spate si biceps": ["Ramat la cablu 4x10", "Tractiuni asistate 4x8", "Flexii biceps 3x12"],
    "Picioare": ["Genuflexiuni 4x8", "Presa picioare 4x10", "Ridicari gambe 4x15"],
    "Fesieri": ["Hip thrust 4x8", "Kickback la cablu 4x14", "Abductii 4x15"],
    "Umeri si abdomen": ["Impins umeri 4x8", "Ridicari laterale 3x15", "Plank 3x60s"],
    "Full body": ["Genuflexiuni 3x8", "Impins la piept 3x8", "Ramat 3x10", "Plank 3x45s"],
  };
  return defaults[focus] || defaults["Full body"];
}

function exerciseIdFromName(name) {
  return String(name || "exercitiu").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function muscleGroupForExercise(name) {
  const text = normalizeExerciseText(name);
  const rules = [
    {
      keys: ["abdomen", "abdomene", "abs", "core", "crunch", "cable crunch", "crunch la cablu", "crunch la scripete", "scripete abdomen", "ridicari picioare", "leg raise", "hanging knee raise", "plank", "plans", "sit up", "situp", "ab wheel", "roata abdomen", "dead bug", "mountain climber", "v up"],
      primary: "abdomen",
      secondary: ["oblici"],
    },
    {
      keys: ["oblici", "oblique", "obliques", "russian twist", "twist rusesc", "side plank", "plank lateral", "woodchop", "wood chop", "rotatii trunchi", "rotatie trunchi", "cable rotation", "pallof press"],
      primary: "oblici",
      secondary: ["abdomen"],
    },
    {
      keys: ["fesieri", "glute", "glutes", "gluteus", "hip thrust", "glute bridge", "pod fesieri", "pod pentru fesieri", "kickback", "donkey kick", "abductii", "abductie", "abduction", "abductor", "frog pump", "pull through", "cable pull through"],
      primary: "fesieri",
      secondary: ["biceps femural", "lombari"],
    },
    {
      keys: ["biceps femural", "femural", "hamstring", "hamstrings", "leg curl", "flexii femural", "flexii picioare", "indreptari romanesti", "romanian deadlift", "rdl", "stiff leg", "good morning", "nordic curl"],
      primary: "biceps femural",
      secondary: ["fesieri", "lombari"],
    },
    {
      keys: ["cvadriceps", "quadriceps", "quads", "genuflexiuni", "squat", "squats", "front squat", "hack squat", "presa picioare", "leg press", "extensii picioare", "leg extension", "fandari", "lunges", "lunge", "bulgarian split squat", "step up", "picioare"],
      primary: "cvadriceps",
      secondary: ["fesieri", "biceps femural"],
    },
    {
      keys: ["adductori", "adductor", "adductie", "adductii", "adduction", "inner thigh", "coapse interioare"],
      primary: "adductori",
      secondary: ["cvadriceps", "fesieri"],
    },
    {
      keys: ["gambe", "gamba", "calf", "calves", "ridicari gambe", "calf raise", "seated calf", "standing calf"],
      primary: "gambe",
      secondary: [],
    },
    {
      keys: ["lombari", "lombar", "lower back", "erector", "hiperextensii", "hiperextensie", "hyperextension", "back extension", "superman", "indreptari", "deadlift"],
      primary: "lombari",
      secondary: ["biceps femural", "fesieri"],
    },
    {
      keys: ["umar posterior", "deltoid posterior", "rear delt", "rear delts", "reverse fly", "reverse pec deck", "face pull", "fluturari inverse", "ridicari inverse"],
      primary: "umar posterior",
      secondary: ["trapez", "dorsal"],
    },
    {
      keys: ["umeri", "umar", "deltoid", "deltoizi", "shoulder", "shoulders", "impins umeri", "shoulder press", "presa umeri", "militar", "military press", "arnold press", "ridicari laterale", "lateral raise", "ridicari frontale", "front raise", "upright row"],
      primary: "umar anterior",
      secondary: ["triceps", "umar posterior"],
    },
    {
      keys: ["trapez", "traps", "shrug", "shrugs", "ridicari din umeri", "farmer walk", "farmer carry"],
      primary: "trapez",
      secondary: ["umar posterior", "antebrat"],
    },
    {
      keys: ["piept", "pectorali", "pectoral", "chest", "bench press", "incline press", "decline press", "impins la piept", "impins inclinat", "impins declinat", "fluturari", "fly", "flyes", "cable fly", "pec deck", "flotari", "push up", "pushup", "dips piept"],
      primary: "piept",
      secondary: ["triceps", "umar anterior"],
    },
    {
      keys: ["triceps", "pushdown", "pressdown", "extensii triceps", "triceps extension", "skull crusher", "french press", "dips triceps", "close grip bench", "diamond push up"],
      primary: "triceps",
      secondary: ["piept", "umar anterior"],
    },
    {
      keys: ["spate", "dorsal", "lat", "lats", "back", "tractiuni", "pull up", "pullup", "chin up", "lat pulldown", "pulldown", "helcometru", "ramat", "row", "seated row", "barbell row", "dumbbell row", "t bar row", "pullover", "straight arm pulldown"],
      primary: "dorsal",
      secondary: ["biceps", "umar posterior"],
    },
    {
      keys: ["antebrat", "antebrate", "forearm", "forearms", "wrist curl", "reverse curl", "priza", "grip", "farmer"],
      primary: "antebrat",
      secondary: ["biceps"],
    },
    {
      keys: ["biceps", "flexii", "flexie", "curl", "curls", "hammer curl", "preacher curl", "concentration curl", "scott", "ez curl"],
      primary: "biceps",
      secondary: ["antebrat"],
    },
  ];
  return rules.find((rule) => rule.keys.some((key) => text.includes(key))) || { primary: "grupa neatribuita", secondary: [] };
}

function normalizeExerciseText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ăâ]/g, "a")
    .replace(/[î]/g, "i")
    .replace(/[șş]/g, "s")
    .replace(/[țţ]/g, "t")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function defaultRestSeconds(name) {
  const text = normalizeExerciseText(name);
  if (text.includes("genuflexiuni") || text.includes("squat") || text.includes("indreptari") || text.includes("deadlift") || text.includes("impins")) return 120;
  if (text.includes("plank") || text.includes("abdomen") || text.includes("crunch") || text.includes("abs")) return 60;
  return 90;
}

function elapsedSeconds(startedAt) {
  return Math.max(0, Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
}

function formatDuration(seconds) {
  const minutes = Math.floor(Number(seconds || 0) / 60);
  const rest = Math.floor(Number(seconds || 0) % 60);
  return `${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
}

function formatKg(value) {
  const rounded = Math.round(Number(value || 0));
  return `${rounded.toLocaleString("ro-RO")} kg`;
}

function formatMl(value) {
  return `${Math.round(Number(value || 0)).toLocaleString("ro-RO")} ml`;
}

function formatMetric(value, type) {
  if (type === "volume") return formatKg(value);
  if (type === "records") return `${value} recorduri`;
  return `${value}`;
}

function formatDateShort(key) {
  const date = parseLocalDate(key);
  return `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function normalizeChallenge(challenge) {
  if (!challenge || typeof challenge !== "object" || !CHALLENGES.some((item) => item.id === challenge.challengeId)) return null;
  return {
    id: challenge.id || makeId("challenge"),
    challengeId: challenge.challengeId,
    startDate: challenge.startDate || toKey(new Date()),
    endDate: challenge.endDate || toKey(addDays(new Date(), 29)),
    currentValue: Number(challenge.currentValue || 0),
    status: challenge.status || "activa",
    completedAt: challenge.completedAt || "",
  };
}

function classNameSafe(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

function toKey(date) {
  const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return `${local.getFullYear()}-${String(local.getMonth() + 1).padStart(2, "0")}-${String(local.getDate()).padStart(2, "0")}`;
}

function parseLocalDate(key) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, count) {
  const next = new Date(date);
  next.setDate(next.getDate() + count);
  return next;
}

function startOfWeek(date) {
  const copy = new Date(date);
  const day = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function daysBetween(start, end) {
  const day = 24 * 60 * 60 * 1000;
  const cleanStart = parseLocalDate(toKey(start));
  const cleanEnd = parseLocalDate(toKey(end));
  return Math.ceil((cleanEnd - cleanStart) / day);
}

function formatDateLong(key) {
  const date = parseLocalDate(key);
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
