import wave, struct, math, os

SR = 22050
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "sounds")
os.makedirs(OUT, exist_ok=True)

def tone(freq, dur, vol=0.5, wave_type="square", fade=0.02, pitch_end=None):
    n = int(SR * dur)
    samples = []
    for i in range(n):
        t = i / SR
        f = freq if pitch_end is None else freq + (pitch_end - freq) * (i / n)
        phase = 2 * math.pi * f * t
        if wave_type == "square":
            v = 1.0 if math.sin(phase) >= 0 else -1.0
        elif wave_type == "sine":
            v = math.sin(phase)
        elif wave_type == "noise":
            v = (hash((i, 42)) % 2000 - 1000) / 1000.0
        else:
            v = math.sin(phase)
        # envelope
        fade_n = int(SR * fade)
        env = 1.0
        if i < fade_n:
            env = i / fade_n
        elif i > n - fade_n:
            env = (n - i) / fade_n
        samples.append(v * vol * env)
    return samples

def concat(*chunks):
    out = []
    for c in chunks:
        out.extend(c)
    return out

def silence(dur):
    return [0.0] * int(SR * dur)

def save(name, samples):
    path = os.path.join(OUT, name)
    with wave.open(path, "w") as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(SR)
        frames = b"".join(struct.pack("<h", int(max(-1, min(1, s)) * 32767)) for s in samples)
        f.writeframes(frames)
    print("wrote", path)

# Game start: ascending 3-note chime
save("start_chime.wav", concat(
    tone(523, 0.12, 0.4, "square"),
    tone(659, 0.12, 0.4, "square"),
    tone(784, 0.18, 0.45, "square"),
))

# Level setup loads: low single tone
save("setup_tone.wav", tone(196, 0.5, 0.35, "sine"))

# Wrong decision: low buzz
save("wrong_buzz.wav", tone(110, 0.3, 0.5, "square"))

# Right decision: bright ascending blip
save("right_blip.wav", concat(
    tone(660, 0.06, 0.4, "square"),
    tone(880, 0.08, 0.45, "square"),
))

# Level fail: descending 3-note phrase
save("fail_phrase.wav", concat(
    tone(392, 0.15, 0.45, "square"),
    tone(330, 0.15, 0.45, "square"),
    tone(261, 0.25, 0.45, "square"),
))

# Level succeed: ascending 4-note melody
save("succeed_melody.wav", concat(
    tone(392, 0.1, 0.4, "square"),
    tone(523, 0.1, 0.4, "square"),
    tone(659, 0.1, 0.4, "square"),
    tone(784, 0.2, 0.45, "square"),
))

# Reveal screen loads: soft tone
save("reveal_tone.wav", tone(440, 0.6, 0.25, "sine", fade=0.15))

# Bias caught: low thud
save("bias_caught.wav", tone(90, 0.25, 0.5, "sine", fade=0.05))

# Bias escaped: bright tick
save("bias_escaped.wav", tone(1200, 0.08, 0.35, "square", fade=0.01))

# Dispatcher ring: two-tone alternating (phone ring)
save("dispatcher_ring.wav", concat(
    tone(480, 0.4, 0.3, "sine"),
    tone(440, 0.4, 0.3, "sine"),
    silence(0.3),
    tone(480, 0.4, 0.3, "sine"),
    tone(440, 0.4, 0.3, "sine"),
))

# Question arrival: single soft click/tone
save("question_arrive.wav", tone(300, 0.1, 0.3, "sine", fade=0.02))

# Impact / flash moment: sharp low hit
save("impact.wav", concat(
    tone(80, 0.15, 0.6, "square"),
    tone(60, 0.2, 0.4, "sine"),
))

# Consequence stamp: heavy descending thud
save("consequence.wav", concat(
    tone(220, 0.15, 0.45, "square"),
    tone(140, 0.3, 0.5, "square"),
))

print("done")
